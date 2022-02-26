/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';

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

export default function Post({ post }) {
  console.log(post);
  return (
    <>
      <div>
        <img src="" alt="banner" />
      </div>
      <header>
        <h1>titulo</h1>
        <div className="info">
          <span>data</span>
          <span>autor</span>
          <span>minutos</span>
        </div>
      </header>
      <article>
        <strong>conteudo heading 1</strong>
        <p>artigo 1</p>
      </article>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['post.uid'],
      pageSize: 100,
    }
  );

  return {
    paths: [{ params: { slug: 'como-utilizar-hooks' } }],
    fallback: true,
  };
};

export const getStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      author: response.data.author,
      content: {
        heading: response.data.content,
        body: {
          text: response.data.content,
        },
      },
      banner: {
        url: response.data.banner,
      },
    },
  };
  return { props: { post }, redirect: 60 * 30 }; // 30 minutes
};
