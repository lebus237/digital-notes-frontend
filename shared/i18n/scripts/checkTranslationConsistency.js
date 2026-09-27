const fs = require('fs')
const path = require('path')

const REPO_ROOT = path.resolve(__dirname, '../../..')

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

const parseArgs = () => {
   const args = process.argv.slice(2)
   const options = { package: 'app', locales: null, failOnMatch: false }

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
      } else if (arg === '--fail-on-match') {
         options.failOnMatch = true
      } else if (arg === '--help' || arg === '-h') {
         console.log(`Usage: node ${path.basename(__filename)} [options]

Options:
  --package=<name|all>  Target package(s): app, landing, or all (default: app; comma-separated)
  --locales=<list>      Comma-separated locales to check (default: auto-detect all *.json in packages/<pkg>/public/i18n)
  --fail-on-match       Exit with code 1 if any identical cross-language groups are found
`)
         process.exit(0)
      }
   }

   return options
}

function resolvePackages(packageArg) {
   const raw = packageArg
      .split(',')
      .map(p => p.trim().toLowerCase())
      .filter(Boolean)

   const all = ['app', 'landing']
   if (raw.includes('all')) return all.filter(pkg => fs.existsSync(path.resolve(REPO_ROOT, `packages/${pkg}/public/i18n`)))
   const resolved = raw.length ? raw : ['app']
   for (const pkg of resolved) {
      if (!all.includes(pkg)) throw new Error(`Unknown package "${pkg}". Expected one of: ${all.join(', ')}, all`)
   }
   return resolved.filter(pkg => {
      const dir = path.resolve(REPO_ROOT, `packages/${pkg}/public/i18n`)
      if (!fs.existsSync(dir)) {
         console.warn(`[warn] Skipping package "${pkg}": directory not found: ${dir}`)
         return false
      }
      return true
   })
}

function listLocalesOnDisk(packageDir) {
   const files = fs.readdirSync(packageDir)
   const locales = []
   for (const file of files) {
      if (!file.endsWith('.json')) continue
      const full = path.join(packageDir, file)
      try {
         if (!fs.statSync(full).isFile()) continue
      } catch {
         continue
      }
      locales.push(path.basename(file, '.json'))
   }
   return locales
}

const readLocale = (pkg, locale) => {
   const filePath = path.join(REPO_ROOT, `packages/${pkg}/public/i18n/${locale}.json`)
   if (!fs.existsSync(filePath)) {
      throw new Error(`Locale file not found: ${filePath}`)
   }
   const nested = JSON.parse(fs.readFileSync(filePath, 'utf8'))
   return flatten(nested)
}

const isComparable = (value, key) =>
   typeof value === 'string' && value.trim() !== '' && value !== key

function checkPackage(pkg, explicitLocales, failOnMatch) {
   const pkgDir = path.resolve(REPO_ROOT, `packages/${pkg}/public/i18n`)
   const locales = explicitLocales || listLocalesOnDisk(pkgDir)

   if (!locales.length) {
      console.log(`[${pkg}] No locale files found in ${pkgDir}`)
      return 0
   }

   console.log(`\n[${pkg}] Checking ${locales.length} locales: ${locales.join(', ')}`)

   const translations = Object.fromEntries(locales.map(locale => [locale, readLocale(pkg, locale)]))
   const keys = new Set(locales.flatMap(locale => Object.keys(translations[locale])))
   let matches = 0

   for (const key of [...keys].sort()) {
      const valueGroups = new Map()

      for (const locale of locales) {
         const value = translations[locale][key]
         if (!isComparable(value, key)) continue

         const group = valueGroups.get(value) || []
         group.push(locale)
         valueGroups.set(value, group)
      }

      const duplicateGroups = [...valueGroups.entries()].filter(([, groupedLocales]) => groupedLocales.length > 1)
      if (!duplicateGroups.length) continue

      matches += duplicateGroups.length
      console.log(`\n  ${key}`)
      duplicateGroups.forEach(([value, groupedLocales]) => {
         console.log(`    [${groupedLocales.join(', ')}] ${JSON.stringify(value)}`)
      })
   }

   console.log(`\n[${pkg}] Found ${matches} identical cross-language translation group(s).`)
   if (failOnMatch && matches > 0) process.exitCode = 1
   return matches
}

try {
   const options = parseArgs()
   const packages = resolvePackages(options.package)
   if (!packages.length) throw new Error('No valid packages to process.')
   for (const pkg of packages) {
      checkPackage(pkg, options.locales, options.failOnMatch)
   }
} catch (error) {
   console.error(`Translation consistency check failed: ${error.message}`)
   process.exitCode = 1
}
