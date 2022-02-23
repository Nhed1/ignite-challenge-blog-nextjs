import { GetStaticProps } from 'next';
import { ReactElement } from 'react';

import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): ReactElement {
  console.log(postsPagination.results);
  return (
    <div className={styles.container}>
      {postsPagination.results.map(post => {
        return (
          <article className={styles.post} key={post.uid}>
            <strong>{post.data.title}</strong>
            <p>{post.data.subtitle}</p>
            <div className={styles.info}>
              <span>{post.first_publication_date}</span>
              <span>{post.data.author}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'posts.content'],
      pageSize: 2,
    }
  );

  const results = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.last_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
      data: post.data,
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results,
      },
    },
  };
};
