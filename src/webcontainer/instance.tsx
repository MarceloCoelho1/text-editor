import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer


export async function getWebContainerInstance() {
   if(!webcontainerInstance) {
    webcontainerInstance = await WebContainer.boot()
   }

    return webcontainerInstance   

}



  