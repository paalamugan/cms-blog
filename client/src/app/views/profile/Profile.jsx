import React, { Component } from "react";
import { Card } from "@material-ui/core";

class Profile extends Component {
  render() {
    return (
      <div className="m-sm-30">
        <Card className="px-6 pt-2 pb-4">
          <h1>My profile</h1>
        </Card>
      </div>
    );
  }
}

export default Profile;
