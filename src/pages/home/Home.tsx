import { IonButton, IonButtons, IonContent, isPlatform, IonIcon, IonItem, IonLabel, IonPage, IonRefresher, IonRefresherContent, RefresherEventDetail, useIonLoading, useIonToast } from '@ionic/react';
import { memo, useEffect, useState } from 'react';
import Header from '../../components/header';
import './Home.css';
import { chevronDownCircleOutline, clipboard, close, refresh, trash } from "ionicons/icons"
import { firestore } from '../../firebase';
import swal from 'sweetalert';
import { DocumentSnapshot } from 'firebase/firestore';
import { Clipboard } from "@capacitor/clipboard"
interface dataProp {
  id: string
  text: string
  time: number
}

const Home: React.FC = () => {
  const [texts, setTexts] = useState([])
  const [present, dismiss] = useIonToast();
  const [loading, rmLoading] = useIonLoading()
  const loadData = async () => {
    try {
      let data = await firestore.getCollection('texts')
      let mapped = data.map((tex: DocumentSnapshot) => ({ id: tex.id, ...tex.data() } as dataProp))
      setTexts(mapped as any)
    } catch (error) {
      console.log(error)
      swal('Error', "Error loading data", 'error')
    }
  }
  useEffect(() => {
    (async () => {
      await loading({
        message: "Loading data please wait...",
        backdropDismiss: false
      })
      await loadData()
      setTimeout(() => rmLoading(), 2000)
    })()
  }, [])

  const loadFromPC = async () => {
    await loading({ message: "Loading data please wait...", backdropDismiss: false })
    await loadData()
    setTimeout(() => rmLoading(), 2000)
  }

  const loadFromMobile = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadData()
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  }
  const showToast = (text = "Copied to clipboard") => present({
    message: text,
    buttons: [{ icon: close, role: "cancel", handler: () => dismiss() }],
    duration: 1000,
  })

  const copied = async (text: string) => {
    await Clipboard.write({ string: text })
    showToast()
  }
  const delText = async (idx: string) => {
    await loading({ message: "Deleting...", backdropDismiss: false })
    try {
      firestore.delDoc('texts', idx)
      showToast("Deleted")
      setTexts(texts.filter((_: dataProp, i) => _.id !== idx))
    } catch (error) {
      swal('Error', "Error deleting data", 'error')
    }
    rmLoading()
  }
  return (
    <IonPage>
      <Header name='Home' />
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
          texts.map((text: dataProp) => <IonItem key={text.id} lines="full">
            <IonLabel>
              <div className='text-lg'>{text.text}</div>
              <div className='text-sm'>{new Date(text.time).toLocaleString().replace(",", "  ")}</div>
            </IonLabel>
            <IonButtons>
              <IonButton onClick={() => copied(text.text)} fill='clear' slot="end" >
                <IonIcon slot="icon-only" md={clipboard} color="primary" />
              </IonButton>
              <IonButton onClick={() => delText(text.id)} fill='clear' >
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
};

export default memo(Home);
