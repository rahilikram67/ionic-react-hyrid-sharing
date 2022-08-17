import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getStorage, uploadBytes, ref, listAll, deleteObject, list, getBlob, getDownloadURL } from "firebase/storage";
const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGESENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const _dbstore = getFirestore(app);
const _storage = getStorage(app, "gs://realtime-share.appspot.com");
export const firestore = {
    async addDoc(collection_name: string, data: any) {
        let _collection = collection(_dbstore, collection_name)
        await addDoc(_collection, data)
    },
    async getCollection(collection_name: string) {
        let _collection = collection(_dbstore, collection_name)
        return (await getDocs(_collection)).docs
    },
    async delDoc(collection_name: string, id: string) {
        return await deleteDoc(doc(_dbstore, collection_name, id));
    }
}

export const storage = {

    async uploadFile(file: File) {
        const storageRef = ref(_storage, `images/${file.name}`);
        return await uploadBytes(storageRef, file, { contentType: file.type });
    },
    async getFile(file: string) {
        const storageRef = ref(_storage, "images/" + file);
        return await getDownloadURL(storageRef)
    },
    async listAllFiles() {
        const storageRef = ref(_storage, "images");
        return (await listAll(storageRef)).items
    },
    async deleteFile(file: string) {
        const storageRef = ref(_storage, "images/" + file);
        return await deleteObject(storageRef)
    }
}


