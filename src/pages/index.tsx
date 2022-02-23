import { GetStaticProps } from 'next';
import { ReactElement } from 'react';

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

export default function Home({ posts }): ReactElement {
  console.log(posts);
  return (
    <>
      <p>hello world</p>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: [
        'posts.title',
        'posts.subtitle',
        'posts.author',
        'posts.banner',
        'posts.content',
      ],
      pageSize: 2,
    }
  );

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.last_publication_date,
      next_page: post.url,
      data: post.data,
    };
  });

  return {
    props: { posts },
  };
};