export class EnumHelper {
   static isEnumValue<T extends object>(enumObj: T, value: unknown): value is T[keyof T] {
      const enumValues = Object.values(enumObj).filter(
         v => typeof v !== 'number' || !isNaN(v as number),
      )
      return enumValues.includes(value as any)
   }

   static toList<T extends object>(enumObj: T): Array<{ key: string; value: any }> {
      return Object.entries(enumObj).map(([key, value]) => ({ key: key, value: value }))
   }
}

export type EnumValues<E> = E extends Record<string, infer V> ? V : never
