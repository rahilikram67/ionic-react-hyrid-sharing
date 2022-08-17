import { IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from "@ionic/react"
import React from "react"
interface Props {
    name: string
}
const Header: React.FC<Props> = ({ name }) => {
    return <IonHeader className='lg:hidden'>
        <IonToolbar>
            <IonButtons>
                <IonMenuButton></IonMenuButton>
                <IonTitle size="large">{name}</IonTitle>
            </IonButtons>
        </IonToolbar>
    </IonHeader>
}
export default React.memo(Header)