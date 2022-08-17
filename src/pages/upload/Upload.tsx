import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonPage, IonTextarea, useIonLoading } from "@ionic/react";
import { cloudUpload, documentText, fileTrayFull, trash } from "ionicons/icons";
import React, { useState } from "react";
import Header from "../../components/header";
import "./Upload.css";
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone, { IFileWithMeta } from 'react-dropzone-uploader'
import { useForm } from "react-hook-form"
import { firestore, storage } from "../../firebase"
import swal from "sweetalert"
const Upload: React.FC = () => {
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            text: ""
        }
    })
    const [loading, rmLoading] = useIonLoading()
    const fileSubmit = async (files: IFileWithMeta[], allFiles: IFileWithMeta[]) => {
       
        await loading({ message: `Uploading file ${files.length} please wait...`, backdropDismiss: false })
        try {
            for (let f of files) {
                await storage.uploadFile(f.file)
                
                f.remove()
            }
            swal("Success", "File uploaded successfully", "success")
        } catch (error) {
            console.log(error)
            swal("Error", "Error uploading file " + files[0].file.name, "error")
        }
        await rmLoading()
        //allFiles.forEach((f: IFileWithMeta) => f.remove())
    }
    const onSubmit = async (data: { text: string }) => {
        Object.assign(data, { time: Date.now() })
        loading({
            message: "Uploading text please wait...",
        })
        try {
            await firestore.addDoc("texts", data)
            setValue("text", "")
        } catch (error: any) {
            swal("Error", "Failed to upload text", "error")
        }
        rmLoading()
    }

    return <IonPage>
        <Header name="upload" />
        <IonContent>
            <IonItem lines="none" className="lg:ml-10 lg:mt-10 mt-5">
                <IonIcon slot="start" className="text-5xl" md={documentText}></IonIcon>
                <IonLabel><span className="text-2xl font-bold">Upload Text</span></IonLabel>
            </IonItem>
            <form onSubmit={handleSubmit(onSubmit)}>
                <IonTextarea {...register("text")} rows={6} autoGrow className="w-[95%] mx-auto lg:mt-10 border-4 border-gray-400 rounded"></IonTextarea>
                <div className="flex items-center justify-center w-[95%] mx-auto mt-3">
                    <IonButton onClick={() => setValue("text", "")} className="upload-ion-button h-14 w-14" color="danger" fill="solid">
                        <IonIcon size="large" md={trash} slot="icon-only"></IonIcon>
                    </IonButton>
                    <div className="mx-3"></div>
                    <IonButton type="submit" className="upload-ion-button h-14 w-14" color="primary" size="large" fill="solid">
                        <IonIcon size="large" md={cloudUpload} slot="icon-only"></IonIcon>
                    </IonButton>
                </div>
            </form>
            <IonItem lines="none" className="lg:ml-10 lg:mt-10 mt-5">
                <IonIcon slot="start" className="text-5xl" md={fileTrayFull}></IonIcon>
                <IonLabel><span className="text-2xl font-bold">Upload Files</span></IonLabel>
            </IonItem>
            <Dropzone
                onSubmit={fileSubmit}
                addClassNames={{ dropzone: "overflow-auto border h-auto" }}
            />
        </IonContent>
    </IonPage>
}

export default React.memo(Upload);