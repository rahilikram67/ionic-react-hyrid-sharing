import { IonAvatar, IonContent, IonIcon, IonImg, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { list, listSharp, fileTrayFull, fileTrayFullOutline, cloudUpload, cloudUploadOutline } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Text',
    url: '/text',
    iosIcon: listSharp,
    mdIcon: list
  },
  {
    title: 'Files',
    url: '/files',
    iosIcon: fileTrayFullOutline,
    mdIcon: fileTrayFull
  },
  {
    title: 'Upload',
    url: '/upload',
    iosIcon: cloudUploadOutline,
    mdIcon: cloudUpload
  }
];



const Menu: React.FC = () => {
  const location = useLocation();
  const { pathname } = location
  return (
    <IonMenu className='border' contentId="main" type="reveal">
      <IonContent>
        <IonList className='border-b'>
          <IonItem lines='none' className='flex items-center justify-center mb-10'>
            <IonAvatar slot='start' className='w-20 h-20 my-auto'>
              <IonImg src="logo.jpg" alt="ionic" />
            </IonAvatar>
            <IonLabel className='flex items-center justify-center'>
              <div className='font-bold text-2xl'>Share'O Pedia</div>
              <div className='text-lg'>Share9090%123</div>
            </IonLabel>
          </IonItem>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem color={pathname === appPage.url ? 'primary' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail className='rounded'>
                  <div className={(pathname === appPage.url ? "text-2xl" : "text-lg") + " flex items-center"}>
                    <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                    <span className='ml-5'>{appPage.title}</span>
                  </div>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
