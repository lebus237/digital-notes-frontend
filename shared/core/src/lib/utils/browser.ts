import { getApiEndpoint } from './runtime-config'

export const printLink = (link: any, width?: number, withApi: boolean = true) => {
   return window.open(
      withApi ? `${getApiEndpoint()}${link}` : link,
      '_blank',
      `toolbar=yes,location=yes,directories=no,status=0,
            menubar=yes,scrollbars=yes,resizable=no,left=20,top=20,width=1000,height=${width ?? 600}`,
   )
}
