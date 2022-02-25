/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';

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
  // const prismic = getPrismicClient();
  return {
    paths: [],
    fallback: 'blocking',
  };
  // const posts = await prismic.query([Prismic.predicates.at("document.type")]);
};

export const getStaticProps = async context => {
  const prismic = getPrismicClient();

  const { slug } = context.params;

  const response = await prismic.getByUID('post', String(slug), {});
  console.log(response);

  const post = {
    data: {
      title: RichText.asText(response.data.title),
      banner: {
        url: response.url,
      },
      content: {
        heading: response.data.heading,
        body: {
          text: response.data.text,
        },
      },
    },
  };
  return { props: { post } };
};
