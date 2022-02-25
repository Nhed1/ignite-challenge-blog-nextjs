/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/button-has-type */
import { GetStaticProps } from 'next';
import { ReactElement, useState } from 'react';
import Link from 'next/link';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { Head } from 'next/document';
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
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function loadNextPage(url: string) {
    const data = await fetch(url).then(response => response.json());
    setNextPage(data.next_page);
    setPosts(state => [...state, ...data.results]);
  }

  return (
    <div className={styles.container}>
      {posts.map(post => {
        return (
          <article key={post.uid} className={styles.post}>
            <Link href={`/post/${post.uid}`}>
              <a>
                <strong>{post.data.title}</strong>
              </a>
            </Link>
            <p>{post.data.subtitle}</p>
            <div className={styles.info}>
              <span>{post.first_publication_date}</span>
              <span>{post.data.author}</span>
            </div>

            {nextPage && (
              <button onClick={() => loadNextPage(nextPage)}>
                Carregar mais posts
              </button>
            )}
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
      pageSize: 1,
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
