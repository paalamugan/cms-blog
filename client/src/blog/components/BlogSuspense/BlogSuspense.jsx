import React, { Suspense } from "react";
import { BlogLoading } from "blog";

const BlogSuspense = props => {
  return <Suspense fallback={<BlogLoading />}>{props.children}</Suspense>;
};

export default BlogSuspense;
