import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useSWR from 'swr';

import Layout, { siteTitle } from '../components/layout';
import Maybe from '../components/maybe';
import checkLogin from '../lib/utils/checklogin';
import storage from '../lib/utils/storage';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'glossary']))
    }
  };
}

export default function Profile() {
  const { t } = useTranslation(['common', 'glossary']);
  const { data: currentUser } = useSWR('user', storage);
  const isLoggedIn = checkLogin(currentUser);

  return (
    <Layout profile>
      <Head>
        <title>{`${siteTitle} - ${
          currentUser && currentUser.family
            ? t('common:ourpage')
            : t('common:mypage')
        }`}</title>
      </Head>
      <main className="d-flex flex-column">
        <Maybe test={isLoggedIn}>
          <header className="page-header">
            <div className="container">
              <h1 className="page-heading">
                {currentUser && currentUser.family
                  ? t('common:ourpage')
                  : t('common:mypage')}
              </h1>
            </div>
            <span className="bg-profile" />
          </header>
          <div className="content w-100">
            <div className="container">
              {currentUser && (
                <h1>{`${t('common:welcomeback')} ${currentUser.handle}`}</h1>
              )}
            </div>
          </div>
        </Maybe>
      </main>
    </Layout>
  );
}