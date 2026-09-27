import { type ComponentType, lazy, Suspense } from 'react'

export function lazyLoad(
   factory: () => Promise<{ default: ComponentType<any> }>,
   props?: Record<string, any>,
) {
   const LazyComponent = lazy(factory)
   return (
      <Suspense fallback={<>Loading ...</>}>
         <LazyComponent {...(props ?? {})} />
      </Suspense>
   )
}
