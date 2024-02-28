const { generateToken } = require("../../lib/authentication/auth");
const transporter = require("../../lib/mails/mailService");
const { adminRegisterSchema, adminLoginSchema } = require("../../lib/validation/admin.validation");
const LmsCreator = require("../../models/Creator");
const LmsSuperAdmin = require("../../models/admin");
const bcrypt = require('bcrypt');

const adminLogin = async (req,res) => {
    try{
        if(!req.body) return res.status(404).json({status:'Failure',message:'Bad Request'});
        const {email,password} = req.body;
        const data = req.body;
        // const { error } = adminLoginSchema.validate(data);
        // if (error) return res.status(400).json({status:'Failure',message:'Bad Request',error: error.details[0].message });
         let role ;
        let admin = await LmsSuperAdmin.findOne({where:{sdMailId:email}});
                if(!admin)
                {
                  let user = await LmsCreator.findOne({where:{ctMail:email}})
                  if(!user)
                  {
                    res.status(400).json({status:'Failure',message:'admin Incorrect username or password'});
                  }
                  else{
                    // let userValid = await bcrypt.compare(password,user.ctPassword);
                    if(user.ctPassword !== password)
                    {
                      res.status(400).json({status:'Failure',message:'user Incorrect username or password'})
                    }
                    else{
                      let creatorUser = await LmsCreator.findOne({attributes:['ctId','ctCompanyId','ctName','ctMail'],where:{ctMail:email}});
                      let credential ={
                        id: creatorUser?.ctId,
                        name:creatorUser?.ctName,
                        mail:creatorUser?.ctMail,
                        role: 'Creator'
                      }
                      let token = await generateToken(credential);
                      res.status(200).json({status:'Success',message:'Login Successfully',data:credential,token:token});
                    }
                  }
                }
                else{
                   let valid = await bcrypt.compare(password,admin.sdPassword)
                   if(!valid)
                   {
                    res.status(400).json({status:'Failure',message:'Incorrect username or password'})
                   }
                   else
                   {
                      let adminUser = await LmsSuperAdmin.findOne({attributes:['sdId','sdnNme','sdMailId'],where:{sdMailId:email}});
                      let credentialAdmin ={
                        id: adminUser?.sdId,
                         name:adminUser?.sdnNme,
                        mail:adminUser?.sdMailId,
                        role: 'Admin'
                      }
                      let token = await generateToken(credentialAdmin);
                      if(!token) console.log('error Found');
                      let mailOptions ={
                        from:'santhilamobiledev@gmail.com',
                        to:'navinivan298@gmail.com',
                        subject: 'Regarding For Your Work',
                        text: 'Hi Indhu!',
                        html: '<div><h1>Welcome</h1><p>Hello Guys</p><button>Click Me...!</button></div>'
                      }
                      transporter.sendMail(mailOptions, (error, info)=>{
                        if (error) return res.status(400).json({status:'Failure',message:'Email Not Send',error:error.message})
                        console.log('Email sent: ' + info.response);
                        
                        res.status(200).json({status:'Success',message:'Login Successfully',data:credentialAdmin,token:token});                         
                      });
                   }
                }
          
    }
    catch(err)
    {
        res.status(500).json({status:'Failure',message:'oops..! somethingwent wrong',error:err.message});
    }
}

const adminRegister = async (req,res) => {
    try{
        if(!req.body)
        {
            res.status(404).json({status:'Failure',message:'Bad Request'})
        }   
        else 
        {
            const data = req.body;
            const { error } = adminRegisterSchema.validate(data);
            if (error) {
              res.status(400).json({status:'Failure',message:'Bad Request',error: error.details[0].message });
            } else {
                const salt =await bcrypt.genSalt(10);
                data.sdPassword = await bcrypt.hash(data.sdPassword, salt);
              let result = await LmsSuperAdmin.create(data);
              if(!result)
              {
                res.status(500).json({status:'Failure',message:'oops..! somethingwent wrong'});
              }
              else{
                res.status(200).json({status:'Success',message:'Admin Created SuccessFully',data:result});
              }
            }  
        }
    }
    catch(err)
    {
        res.status(500).json({status:'Failure',message:'oops..! somethingwent wrong',error:err});
    }
}

module.exports = { adminRegister, adminLogin}