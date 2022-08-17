import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonPage, IonRefresher, IonRefresherContent, isPlatform, RefresherEventDetail, useIonLoading, useIonToast } from "@ionic/react"
import { download, trash, close, chevronDownCircleOutline, refresh } from "ionicons/icons"
import React, { memo, useEffect, useState } from "react"
import Header from "../../components/header"
import "./Files.css"
import { storage } from '../../firebase';
import { StorageReference } from "firebase/storage"
import { Browser } from "@capacitor/browser"
import swal from "sweetalert"
const Files: React.FC = () => {
    const [files, setFiles] = useState<StorageReference[]>([])
    const [present, dismiss] = useIonToast();
    const [loading, rmLoading] = useIonLoading()
    const loadData = async () => {
        let list = await storage.listAllFiles()
        setFiles(list)
    }
    useEffect(() => {
        (async () => {
            await loading({
                message: "Loading data please wait...",
                backdropDismiss: false
            })
            await loadData()
            rmLoading()
        })()
    }, [])

    const loadFromPC = async () => {
        await loading({
            message: "Loading data please wait...",
            backdropDismiss: false
        })
        await loadData()
        setTimeout(() => rmLoading(), 2000)
    }

    const loadFromMobile = async (event: CustomEvent<RefresherEventDetail>) => {
        await loadData()
        setTimeout(() => {
            event.detail.complete();
        }, 2000);
    }
    const downloadFile = async (name: string) => {
        await present({
            message: "Downloading file please wait...",
        })
        try {
            let url = await storage.getFile(name)
            if (!isPlatform("mobile")) {
                window.open(url, 'Download'); 
            }
            else {
                await Browser.open({ url, presentationStyle: "popover" })
            }
        } catch (error) {
            swal("Error", "Error downloading file " + name, "error")
        }
        await dismiss()
    }
    const delFile = async (name: string) => {
        await present({
            message: "Deleting file please wait...",
        })
        try {
            await storage.deleteFile(name)
            setFiles(files.filter(f => f.name !== name))
        } catch (error) {
            swal("Error", "Error downloading file " + name, "error")
        }
        await dismiss()
    }
    return (
        <IonPage>
            <Header name='Files' />
            <IonContent fullscreen>
                {isPlatform("mobile") && <IonRefresher pullFactor={0.5} pullMin={100} pullMax={200} color='primary' slot="fixed" onIonRefresh={loadFromMobile}>
                    <IonRefresherContent
                        pullingIcon={chevronDownCircleOutline}
                        pullingText="Pull to refresh"
                        refreshingSpinner="crescent"
                        refreshingText="Refreshing...">
                    </IonRefresherContent>
                </IonRefresher>}
                {
                    files.map((file, index) => <IonItem key={index} lines="full">
                        <IonLabel><span className="text-lg hover:text-gray-400 cursor-pointer">{file.name}</span></IonLabel>
                        <IonButtons>
                            <IonButton onClick={() => downloadFile(file.name)} fill='clear' slot="end" >
                                <IonIcon slot="icon-only" md={download} color="primary" />
                            </IonButton>
                            <IonButton onClick={() => delFile(file.name)} fill='clear' >
                                <IonIcon slot="icon-only" md={trash} color="danger" />
                            </IonButton>
                        </IonButtons>
                    </IonItem>)
                }
                {!isPlatform("mobile") && <div className='w-full flex justify-center'>
                    <IonButton size='large' onClick={() => loadFromPC()} expand="block" fill='clear' >
                        <IonIcon slot="icon-only" md={refresh} color="primary" />
                    </IonButton>
                </div>}
            </IonContent>
        </IonPage>
    );
}

export default memo(Files);
