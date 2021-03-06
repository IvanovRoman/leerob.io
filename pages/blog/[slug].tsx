import { useMDXComponent } from 'next-contentlayer/hooks';
import components from 'components/MDXComponents';
import { getTweets } from 'lib/twitter';
import Tweet from 'components/Tweet';
import BlogLayout from 'layouts/blog';
import { allBlogs } from 'contentlayer/generated';

export default function Post({ post, tweets }: {post: any, tweets: any[] }) {
  const Component = useMDXComponent(post.body.code);
  const StaticTweet = ({ id }) => {
    const tweet = tweets.find((tweet) => tweet.id === id);
    return <Tweet {...tweet} />;
  }
  return (
    <BlogLayout post={post}>
      <Component 
        components={
          {
            ...components,
            StaticTweet
          } as any
        }
      />
    </BlogLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: allBlogs.map((p) => ({ params: { slug: p.slug }})),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const post = allBlogs.find((post) => post.slug === params.slug);
  const tweets = await getTweets(post?.tweetIds || []);

  return { props: { post, tweets } };
}
