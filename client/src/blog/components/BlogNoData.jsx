import React from "react";
import { Card, Grid } from "@material-ui/core";

const BlogNoData = ({ children, className, message }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      className={`mt-25${className ? (' ' + className) : ' '}`}
    >

      <Grid item xs={10} sm={8} md={6} lg={4} xl={3}>
        <Card className="my-10">
          <Card elevation={0} className={isImageLoaded ? 'upgrade-card bg-light-primary p-sm-24' : 'display-none'}>
            <img src="/assets/images/illustrations/no-data.png" alt="no-data" onLoad={() => {
              setIsImageLoaded(true);
            }} />
            {children ? children : (
              <h4 className="mt-10">{ message || 'No result found.'}</h4>
            )}
          </Card>
        </Card>
      </Grid>   
    </Grid>
  );
};

export default BlogNoData;
