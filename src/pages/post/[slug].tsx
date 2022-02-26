/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FaUser } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';
import { MdOutlineDateRange } from 'react-icons/md';

import { useRouter } from 'next/router';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  if (router.isFallback) {
    return <span>Carregando...</span>;
  }

  return (
    <>
      <div className={styles.container}>
        <img src={post.data.banner.url} alt="banner" />

        <div className={styles.content}>
          <header className={styles.header}>
            <h1>{post.data.title}</h1>
            <div className={styles.info}>
              <span>
                <MdOutlineDateRange />
                {post.first_publication_date}
              </span>
              <span>
                <FaUser />
                {post.data.author}
              </span>
              <span>
                <BiTime />
                {post.data.content.reduce((acumulator, element) => {
                  const AVARAGE_READ_TIME = 200; // 200 words per minute;
                  const headingLen = element.heading.split(' ').length;
                  const bodyLen = element.body[0].text.split(' ').length;
                  acumulator += headingLen + bodyLen;
                  return Math.ceil(acumulator / AVARAGE_READ_TIME);
                }, 0)}
                min
              </span>
            </div>
          </header>
          {post.data.content.map(elementContent => {
            return (
              <article className={styles.content}>
                <h2>{elementContent.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(elementContent.body),
                  }}
                ></div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: [],
      pageSize: 10,
    }
  );

  return {
    paths: response.results.map(post => ({
      params: { slug: post.uid },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});
  const post = {
    uid: response.uid,
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM yyyy',
      { locale: ptBR }
    ),
    data: {
      title: response.data.title,
      author: response.data.author,
      content: response.data.content,
      banner: {
        url: response.data.banner.url,
      },
    },
  };
  return { props: { post }, revalidate: 60 * 5 }; // 5 minutes
};
