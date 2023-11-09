import { connect } from "mongoose";

connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((Error) => {
    console.log("Error Connecting To Database", Error);
  });

export default connect;
