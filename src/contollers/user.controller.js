const { userService} = require("../services");
const { User } = require("../models");// use in delete many 

/** Get user list */
const getUserListRole = async (req, res) => {
  try {
    const getList = await userService.getUserList(req, res);
    const userRole=req.body.role;
    let users=[];
    if(userRole==='user'){
     for(let i=0 ;i<getList.length;i++){
      if(getList[i].role!=="admin"){
        users.push(getList[i]);
        }
        }
        console.log("users",users);
        res.send(users);
        }else{
          res.send(getList);
          }
          
          } catch (err) {
            console.log('Error in getting the user list', err);
            res.status(500).send(err);
            }
            };


/** Get user list */
const getUserList = async (req, res) => {
  try {
    const getList = await userService.getUserList(req, res);

    res.status(200).json({
      success: true,
      message: "Get user list successfully!",
      data: getList,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
/** Get user details by id */
const getUserDetails = async (req, res) => {
  try {
    const getDetails = await userService.getUserById(req.params.userId);
    if (!getDetails) {
      throw new Error("User not found!");
    }

    res.status(200).json({
      success: true,
      message: "User details get successfully!",
      data: getDetails,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



/** user details update by id */
const updateDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userRole=req.body.role;
    const userExists = await userService.getUserById(userId);
    if (!userExists) {
      throw new Error("User not found!");
    }
   if(userRole==='user'){
    throw new Error('You are not allowed to change role of admin');
   }
    await userService.updateUser(userId, req.body);
    res
      .status(200)
      .json({ success: true, message: "User details update successfully!",data:userExists});
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


/** Delete user */
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userExists = await userService.getUserById(userId);
    if (!userExists) {
      throw new Error("User not found!");
    }

    await userService.deleteUser(userId);

    res.status(200).json({
      success: true,
      message: "User delete successfully!",
      data:userExists,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**delete many */
const deleteManyUsers = async (req, res) => {
  try {
    const {_id} = req.body;
const result=await User.deleteMany({_id:{$in:  _id}});
if(result.deletedCount===0){
  throw new Error('No users deleted');
}
    return res.status(200).send({
      success: true,
      message: "Deleted Successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: `${err}`,
    });
  }
};

/**role wise user list */
const getAllUser = async (req, res) => {
  try {
     const data = await userService.getAllUser({ role: req.body.role });
    res.status(200).json({
      success: true,
      message: "User list successfully!",
      data: { data },
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
module.exports = {
   getAllUser,
  getUserListRole,
  getUserList,
  getUserDetails,
  updateDetails,
  deleteUser,
  deleteManyUsers,
};
