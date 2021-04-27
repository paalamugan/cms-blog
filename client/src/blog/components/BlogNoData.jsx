import React from "react";
import { Card, Grid } from "@material-ui/core";

const BlogNoData = ({ children, className, message }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      className={`mt-25${className ? (' ' + className) : ' '}`}
    >

      <Grid item xs={3}>
        <Card className="my-10">
          <Card elevation={0} className="upgrade-card bg-light-primary p-sm-24">
            <img src="/assets/images/illustrations/no-data.svg" alt="no-data" />
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
