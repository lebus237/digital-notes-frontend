const fs = require('fs/promises')
const fsSync = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const REPO_ROOT = path.resolve(__dirname, '../../../..')

// Load env from repo root and each package (dotenv does not override existing vars)
for (const envPath of [
   path.resolve(REPO_ROOT, '.env'),
   path.resolve(REPO_ROOT, 'packages/app/.env'),
   path.resolve(REPO_ROOT, 'packages/landing/.env'),
   path.resolve(REPO_ROOT, 'shared/i18n/.env'),
   path.resolve(__dirname, '../../.env'),
]) {
   if (fsSync.existsSync(envPath)) dotenv.config({ path: envPath })
}
dotenv.config()

const DEEPL_TARGET_LOCALES = {
   cs: 'CS',
   de: 'DE',
   et: 'ET',
   es: 'ES',
   fr: 'FR',
   it: 'IT',
   lt: 'LT',
   lv: 'LV',
   pl: 'PL',
   pt: 'PT-PT',
   ru: 'RU',
   tr: 'TR',
   uk: 'UK',
   ua: 'UK',
   en: 'EN',
}
const DEEPL_FREE_URL = 'https://api-free.deepl.com/v2/translate'
const DEEPL_PRO_URL = 'https://api.deepl.com/v2/translate'

function flatten(obj, prefix = '', out = {}) {
   for (const [key, value] of Object.entries(obj)) {
      const dotted = prefix ? `${prefix}.${key}` : key
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
         flatten(value, dotted, out)
      } else {
         out[dotted] = value
      }
   }
   return out
}

function unflatten(flat) {
   const out = {}
   for (const [dotted, value] of Object.entries(flat)) {
      const parts = dotted.split('.')
      let cur = out
      for (let i = 0; i < parts.length - 1; i++) {
         const part = parts[i]
         if (!cur[part] || typeof cur[part] !== 'object' || Array.isArray(cur[part])) {
            cur[part] = {}
         }
         cur = cur[part]
      }
      cur[parts[parts.length - 1]] = value
   }
   return out
}

const parseArgs = () => {
   const args = process.argv.slice(2)
   const options = {
      package: 'app',
      locales: null, // null = auto-detect from disk
      source: 'en',
      batchSize: 50,
      dryRun: false,
      replaceEnglish: false,
      endpoint:
         process.env.DEEPL_API_ENDPOINT ||
         (process.env.DEEPL_API_PLAN === 'pro' ? DEEPL_PRO_URL : DEEPL_FREE_URL),
   }

   for (let index = 0; index < args.length; index += 1) {
      const arg = args[index]
      const next = args[index + 1]

      if (arg === '--') continue
      if (arg === '--package' && next) {
         options.package = next.trim()
         index += 1
      } else if (arg.startsWith('--package=')) {
         options.package = arg.slice('--package='.length).trim()
      } else if (arg === '--locales' && next) {
         options.locales = next
            .split(',')
            .map(locale => locale.trim())
            .filter(Boolean)
         index += 1
      } else if (arg.startsWith('--locales=')) {
         options.locales = arg
            .slice('--locales='.length)
            .split(',')
            .map(locale => locale.trim())
            .filter(Boolean)
      } else if (arg === '--source' && next) {
         options.source = next.trim()
         index += 1
      } else if (arg.startsWith('--source=')) {
         options.source = arg.slice('--source='.length).trim()
      } else if (arg === '--batch-size' && next) {
         options.batchSize = Math.max(1, Number(next) || 50)
         index += 1
      } else if (arg.startsWith('--batch-size=')) {
         options.batchSize = Math.max(1, Number(arg.slice('--batch-size='.length)) || 50)
      } else if (arg === '--dry-run') {
         options.dryRun = true
      } else if (arg === '--replace-english') {
         options.replaceEnglish = true
      } else if (arg === '--help' || arg === '-h') {
         console.log(`Usage: node ${path.basename(__filename)} [options]

Options:
  --package=<name|all>   Target package(s): app, landing, or all (default: app; comma-separated)
  --locales=<list>       Comma-separated target locales (default: auto-detect from disk)
  --source=<locale>      Source locale (default: en)
  --batch-size=<n>       DeepL batch size (default: 50)
  --dry-run              Log what would be translated without writing files
  --replace-english      Also re-translate values that equal the English source

Env:
  DEEPL_API_KEY          Required
  DEEPL_API_ENDPOINT     Override endpoint
  DEEPL_API_PLAN=pro     Use DeepL Pro endpoint (default: Free)
  DEEPL_API_KEY may live in repo .env, packages/app/.env, packages/landing/.env, or CI env
`)
         process.exit(0)
      }
   }

   return options
}

const readJson = async filePath => JSON.parse(await fs.readFile(filePath, 'utf8'))

const isMissing = (value, key, sourceValue, replaceEnglish) =>
   value === undefined ||
   value === null ||
   value === '' ||
   value === key ||
   (replaceEnglish && value === sourceValue)

const protectTokens = value => {
   const tokens = []
   const protectedValue = value.replace(/(\{[^{}]+\}|%\w|<[^>]+>)/g, token => {
      const placeholder = `__WYSUITES_TOKEN_${tokens.length}__`
      tokens.push(token)
      return placeholder
   })
   return { protectedValue, tokens }
}

const restoreTokens = (value, tokens) =>
   value.replace(/__WYSUITES_TOKEN_(\d+)__/g, (_, index) => tokens[Number(index)] ?? '')

const translateBatch = async ({ values, target, source, apiKey, endpoint }) => {
   const protectedValues = values.map(protectTokens)
   const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
         Authorization: `DeepL-Auth-Key ${apiKey}`,
         'content-type': 'application/json',
      },
      body: JSON.stringify({
         text: protectedValues.map(item => item.protectedValue),
         source_lang: (DEEPL_TARGET_LOCALES[source] || source.toUpperCase()),
         target_lang: DEEPL_TARGET_LOCALES[target] || target.toUpperCase(),
         preserve_formatting: true,
      }),
   })

   const payload = await response.json()
   if (!response.ok) {
      throw new Error(payload.message || `DeepL request failed with ${response.status}`)
   }

   const translations = payload.translations
   if (!Array.isArray(translations) || translations.length !== values.length) {
      throw new Error(`DeepL returned an unexpected response for locale ${target}`)
   }

   return translations.map((translation, index) =>
      restoreTokens(translation.text, protectedValues[index].tokens),
   )
}

function resolvePackages(packageArg) {
   const raw = packageArg
      .split(',')
      .map(p => p.trim().toLowerCase())
      .filter(Boolean)

   const all = ['app', 'landing']
   if (raw.includes('all')) return all.filter(pkg => fsSync.existsSync(path.resolve(REPO_ROOT, `packages/${pkg}/public/i18n`)))
   const resolved = raw.length ? raw : ['app']
   // Validate
   for (const pkg of resolved) {
      if (!all.includes(pkg)) throw new Error(`Unknown package "${pkg}". Expected one of: ${all.join(', ')}, all`)
   }
   return resolved.filter(pkg => {
      const dir = path.resolve(REPO_ROOT, `packages/${pkg}/public/i18n`)
      if (!fsSync.existsSync(dir)) {
         console.warn(`[warn] Skipping package "${pkg}": directory not found: ${dir}`)
         return false
      }
      return true
   })
}

function listLocalesOnDisk(packageDir, source) {
   const files = fsSync.readdirSync(packageDir)
   const locales = []
   for (const file of files) {
      if (!file.endsWith('.json')) continue
      const full = path.join(packageDir, file)
      try {
         if (!fsSync.statSync(full).isFile()) continue
      } catch {
         continue
      }
      const locale = path.basename(file, '.json')
      if (locale === source) continue
      locales.push(locale)
   }
   return locales
}

const translateLocale = async ({ pkg, sourceFlat, locale, options, apiKey }) => {
   const pkgDir = path.resolve(REPO_ROOT, `packages/${pkg}/public/i18n`)
   const localePath = path.join(pkgDir, `${locale}.json`)
   let targetNested = {}
   let targetFlat = {}

   try {
      targetNested = await readJson(localePath)
      targetFlat = flatten(targetNested)
   } catch (error) {
      if (error.code !== 'ENOENT') throw error
      // New locale file — start empty
   }

   const missing = Object.entries(sourceFlat).filter(
      ([key, value]) =>
         typeof value === 'string' &&
         isMissing(targetFlat[key], key, value, options.replaceEnglish),
   )

   if (!missing.length) {
      console.log(`${pkg}/${locale}: no missing keys`)
      return 0
   }

   console.log(`${pkg}/${locale}: translating ${missing.length} keys`)
   const translatedValues = []
   for (let index = 0; index < missing.length; index += options.batchSize) {
      const batch = missing.slice(index, index + options.batchSize)
      translatedValues.push(
         ...(await translateBatch({
            values: batch.map(([, value]) => value),
            target: locale,
            source: options.source,
            apiKey,
            endpoint: options.endpoint,
         })),
      )
   }

   missing.forEach(([key], index) => {
      targetFlat[key] = translatedValues[index]
   })

   const nextNested = unflatten(targetFlat)

   if (!options.dryRun) {
      await fs.mkdir(pkgDir, { recursive: true })
      await fs.writeFile(localePath, `${JSON.stringify(nextNested, null, 2)}\n`)
   }

   console.log(`${pkg}/${locale}: ${options.dryRun ? 'would add' : 'added'} ${missing.length} keys`)
   return missing.length
}

const main = async () => {
   const options = parseArgs()
   const apiKey = process.env.DEEPL_API_KEY
   if (!apiKey) {
      throw new Error(
         'Set DEEPL_API_KEY before running this script.\n' +
            'The key may live in .env, packages/app/.env, packages/landing/.env, or the CI environment.\n' +
            'Never commit .env files.',
      )
   }

   const packages = resolvePackages(options.package)
   if (!packages.length) throw new Error('No valid packages to process.')

   for (const pkg of packages) {
      const pkgDir = path.resolve(REPO_ROOT, `packages/${pkg}/public/i18n`)
      const sourcePath = path.join(pkgDir, `${options.source}.json`)
      let sourceNested
      try {
         sourceNested = await readJson(sourcePath)
      } catch (e) {
         if (e.code === 'ENOENT') throw new Error(`Source locale not found: ${sourcePath}`)
         throw e
      }
      const sourceFlat = flatten(sourceNested)

      const locales = options.locales
         ? options.locales.filter(locale => locale !== options.source)
         : listLocalesOnDisk(pkgDir, options.source)

      if (!locales.length) {
         console.log(`${pkg}: no target locales found (auto-detected 0 files besides ${options.source}.json)`)
         continue
      }

      if (options.locales) {
         console.log(`${pkg}: explicit locales: ${locales.join(', ')}`)
      } else {
         console.log(`${pkg}: auto-detected locales: ${locales.join(', ')}`)
      }

      for (const locale of locales) {
         await translateLocale({ pkg, sourceFlat, locale, options, apiKey })
      }
   }
}

main().catch(error => {
   console.error(`Translation failed: ${error.message}`)
   process.exitCode = 1
})
