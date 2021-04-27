import Loadable from "react-loadable";
import Loading from "./Loading";

const BlogLoadable = opts => {
  return Loadable(
    Object.assign(
      {
        loading: Loading,
        delay: 100,
        timeout: 10000
      },
      opts
    )
  );
};

export default BlogLoadable;
