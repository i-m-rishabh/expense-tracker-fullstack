
const getAllFiles = async (req, res) => {
    try{
        const files = await req.user.getFiles();

        res.status(200).json({success:true, files:files});
    } catch(err){
        console.log(err);
        res.status(500).json({success:false, error:err});
    } 
}

module.exports = {
    getAllFiles,
}