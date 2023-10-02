import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const UserBadgeItem = ({ user, handleFunction, admin }) => {

  const useritem = {
    border: "1px solid black",
    backgroundColor: "teal",
    padding: "1px",
    margin: "2px 2px",
    height: "20px",
    width: "70px",
    borderRadius:"5px"
  };

  return (
    <span onClick={handleFunction} style={useritem}>
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon
        style={{
          height: "17px",
          width: "17px",
          position: "relative",
          top: "4px",
        }}
      />
    </span>
  );
};

export default UserBadgeItem;
