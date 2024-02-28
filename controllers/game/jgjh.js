const updateGame = async (req, res) => {
    try {
      const data = req?.body;
      console.log(data);
      const id = req?.params?.id;
      if(data.gameLastTab) {
        data.gameLastTab = JSON.stringify(data.gameLastTab);
      }
      
      if (data.gameLastTab) {
        const findlasttab = await LmsGame.findOne({
          where: { 
            gameId: id
          }
        });
       
        if (findlasttab && findlasttab.gameLastTabArray) {
          let updatedArray;
          // return res.status(404).json({ status: 'Failure', message: findlasttab});
          try {
            // Try to parse the existing value as JSON
            updatedArray = JSON.parse(findlasttab.gameLastTabArray);
            
            // If successful, check if the value is already in the array
            if (!updatedArray.includes(data.gameLastTab)) {
              // If not inside, push the value into the array
              updatedArray.push(data.gameLastTab);
              findlasttab.gameLastTabArray = JSON.stringify(updatedArray);
          await findlasttab.save();
          data.gameLastTabArray=findlasttab.gameLastTabArray;
            } else {
              data.gameLastTabArray=findlasttab.gameLastTabArray
              console.log(`Value ${data.gameLastTab} is already inside gameLastTabArray`);
            }
          } catch (error) {
            // If parsing fails, handle it accordingly
            console.error('Error parsing gameLastTabArray:', error);
            
          }
  
          // Save the updated array back to the database
          
          
          console.log(`Value ${data.gameLastTab} processed for gameLastTabArray`);
        } else {
          console.log('gameLastTabArray not found or is null');
         
        }
        // Other logic...
     
       
       
        // data.gameLastTab = JSON.stringify(data.gameLastTab);
      }
     
      if (!id) return res.status(404).json({ status: 'Failure', message: "bad Request" });
      if (!req.body) return res.status(404).json({ status: 'Failure', message: "bad Request" });
  
      if (data.gameSkills && Array.isArray(data.gameSkills) && data.gameSkills.length > 0) {
        const updatedSkills = await Promise.all(
          data.gameSkills.map(async (skill) => {
            const existingSkill = await Skill.findOne({ where: { crSkillName: skill.crSkillName } });
  
            return existingSkill ? skill.crSkillId : (await Skill.create({
              crSkillName: skill.crSkillName,
              crSkillStatus: 'Active',
              crDeleteStatus: 'No',
              crCreatedDate: Date.now(),
              crUserAgent: req.headers['user-agent'],
              crIpAddress: req.connection.remoteAddress,
              crDeviceType: req.device.type,
            })).crSkillId;
          })
        );
  
        data.gameSkills = updatedSkills.join(',');
      }
     
      
      
      const checkextentsion = await LmsGame.findOne({ where: { gameId: id } });
  
  if (checkextentsion && checkextentsion.gameExtensionId) {
    data.gameExtensionId = checkextentsion.gameExtensionId;
  } else {
    data.gameExtensionId = id;
  }
  
  
  try {
    const record = await LmsGame.update(data, {
      where: {
        ...(checkextentsion && checkextentsion?.gameExtensionId
          ? { gameExtensionId: checkextentsion.gameExtensionId }
          : { gameId: id }),
        gameQuestNo: data.gameQuestNo
      }
    });
  
    // Handle the result as needed
    console.log('Record updated successfully:', record);
  
    // Send a success response
    res.status(200).json({ status: 'Success', message: 'Record updated successfully' });
  } catch (error) {
    // Handle validation errors
    console.error('Validation error:', error);
  
    // Send an error response
    res.status(400).json({ status: 'Failure', message: 'Validation error', error: error.message });
  }
  
  
     
  res.status(400).json({ status: 'Failure', message: "error.message",data:data.gameSkills });
                  const propertiesToRemove = ['gameTotalScore', 'gameIsSetMinPassScore', 'gameMinScore','gameIsSetDistinctionScore','gameDistinctionScore','gameIsSetSkillWiseScore','gameIsSetBadge','gameBadgeName','gameIsSetCriteriaForBadge','gameAwardBadgeScore','gameScreenTitle','gameIsSetCongratsScoreWiseMessage','gameCompletedCongratsMessage','gameMinimumScoreCongratsMessage','gameLessthanDistinctionScoreCongratsMessage','gameAboveDistinctionScoreCongratsMessage','gameIsSetDistinctionScore'/* Add more property names */];
  
                  // Remove properties using forEach
                  propertiesToRemove.forEach(property => {
                    delete data[property];
                  });
      
  
     const saved= await LmsGame.update(data, {where : {gameExtensionId: data.gameExtensionId}});
  
     if (!record) return res.status(404).json({ status: 'Failure', message: "bad Request" });
  
  return res.status(200).json({ status: 'Success', message: 'Game Updated Successfully', data: record });
    }
    catch (error) {
     return  res.status(500).json({ status: 'Failure', message: "Internal Server Error", err: error });
    }
  }



  const GetStroy = async (req, res) => {
    try {
      let  id = req.params.id;
      let questNos =req.body.quest
  
    let  stroy = await LmsBlocks.findAndCountAll({
      where: { blockGameId: id ,
        blockDeleteStatus: 'NO',
        blockQuestNo:questNos},
      order: [['blockPrimarySequence', 'ASC']] 
    });
    
    let  resultObject = {};
    let  itemObject = {};
    let  alpabetObject = {};
    let optionsObject={};
       let ansObject={};
       let feedbackObject={};
       let responseObject={};
       let optionTitleObject={};
       let optionsemotionObject={};
       let optionsvoiceObject={};
       let responseemotionObject={};
       let scoreObject={};
       let navigateObjects={};
       let navigateshowObjects={};
       let interactionBlockObject={};
       let maxInput = -Infinity;
       const alpabetObjectsArray = [];
       
  let lastItem;
  
  const alpacount = await lmsQuestionOptions.findOne({
    attributes: ['qpSecondaryId'],
    where: { qpGameId: id },
    order: [['qpOptionId', 'DESC']],
    limit: 1,
  });
  
  let j=0;
  let idCounter = 1;
  let upNextCounter = 2;
  for (let  [index, result] of stroy.rows.entries()) {
            
      // Assuming blockSecondaryId is the property you want to use as the key
      let  key = result.blockChoosen+result.blockSecondaryId;
      let currentVersion = result.blockPrimarySequence;
      let major = currentVersion.split('.');
      // Construct the value object with the desired properties
   
  
  if (result.blockChoosen === 'Interaction') {
    
    try{
      const Question = await lmsQuestionOptions.findAll({
      where: { qpQuestionId: result.blockId,
        qpDeleteStatus: 'NO'},
      order: [['qpSecondaryId', 'ASC']],
      logging: console.log // Log the generated SQL query
    });
     
    console.log('Question',Question );
    // return res.status(500).json({ status: 'Failure' ,error:result.blockId });
    for (let  [i, rows] of Question.entries()) {
      // Use for...of loop or Promise.all to handle async/await correctly
      let value = {
        seqs: major[0]+'.'+idCounter,
        option: rows.qpOptions,
        secondaryId: rows.qpSecondaryId,
      };
      /*******************
       * optionsObject :{ a: test1 ,b: ,c: }
       * optionsObject :{ a: test2 ,b: ,c: }
       * 
       * 
       * 
       */
    
      console.log('rows',rows );
      optionsObject[rows.qpOptions]=rows.qpOptionText ? rows.qpOptionText:'';
      ansObject[rows.qpOptions]=rows.qpTag ? rows.qpTag:'';
  
      feedbackObject[rows.qpOptions]=rows.qpFeedback ? rows.qpFeedback:'';
  
      responseObject[rows.qpOptions]=rows.qpResponse ? rows.qpResponse:'';
  
      optionTitleObject[rows.qpOptions]=rows.qpTitleTag ? rows.qpTitleTag:'';
  
      optionsemotionObject[rows.qpOptions]=rows.qpEmotion ? rows.qpEmotion:'';
      optionsvoiceObject[rows.qpOptions]=rows.qpVoice ? rows.qpVoice:'';
      responseemotionObject[rows.qpOptions]=rows.qpResponseEmotion ? rows.qpResponseEmotion:'';
      scoreObject[rows.qpOptions]=rows.qpScore ? rows.qpScore:'';
      navigateObjects[rows.qpOptions]=rows.qpNextOption ? rows.qpNextOption:'';
      navigateshowObjects[rows.qpOptions]=rows.qpNavigateShow ? rows.qpNavigateShow:'';
      
      alpabetObjectsArray.push(value);
      console.log('After push:', alpabetObjectsArray);
      if(rows.qpResponse){
        interactionBlockObject[`Resp${result.blockSecondaryId}`]=result.blockSecondaryId;
      }
      if(rows.qpFeedback){
        interactionBlockObject[`Feedbk${result.blockSecondaryId}`]=result.blockSecondaryId;
      }
      if(rows.qpTitleTag||result.blockTitleTag){
        interactionBlockObject[`Title${result.blockSecondaryId}`]=result.blockSecondaryId;
      }
    if(result.blockSkillTag){
      interactionBlockObject[`Skills${result.blockSecondaryId}`]=result.blockSecondaryId;
     
    }
    }
    console.log('Final array:', optionsemotionObject);
   
    
      // return res.status(500).json({ status: 'Failure' ,error:scoreObject });
    
    let value = {
      QuestionsEmotion: result.blockCharacterposesId,
      QuestionsVoice:result.blockVoiceEmotions,
      ansObject:ansObject  ,
      blockRoll:result.blockRoll  ,
      feedbackObject:feedbackObject  ,
      interaction:result.blockText  ,
      navigateObjects:navigateObjects  ,
      navigateshowObjects:navigateshowObjects  ,
      optionTitleObject:optionTitleObject  ,
      optionsObject:optionsObject[key]  ,
      optionsemotionObject: optionsemotionObject ,
      optionsvoiceObject: optionsvoiceObject ,
      quesionTitle:result.blockTitleTag  ,
      responseObject:responseObject  ,
      responseemotionObject:responseemotionObject  ,
      scoreObject:scoreObject  ,
      responseRoll:result.blockResponseRoll,
      SkillTag:result.blockSkillTag ,
      status:'yes',
    };
    
      console.log('values',value)
      resultObject[key] = value;
    
  
    
   
    }catch(error){
      return res.status(500).json({ status: 'Failure' ,error:error.message });
    }
   
  }
  
  
  let  items = {
    id: major[0]+'.'+idCounter,
    type: result.blockChoosen,
    upNext: major[0]+'.'+upNextCounter,
    input: result.blockSecondaryId,
    questNo:result.blockQuestNo
  };
  idCounter += 1;
  upNextCounter += 1;
  
  
  
  itemObject[index++] = items;
      // Assign the value object to the key in the resultObject
      lastItem = items.upNext;
      maxInput = Math.max(maxInput, items.input);
      
    }
   
    
    
  
    for (let i = 0; i < alpabetObjectsArray.length; i++) {
      // Get the current row from the array
      const rows = alpabetObjectsArray[i];
     
      // Create a new value object
      let value = {
        seqs: rows.seqs,
        option: rows.option,
        secondaryId: rows.secondaryId,
      };
    
      // Set the value in the alphabetObject using the current key
      alpabetObject[i] = value;
    
      // Update key for the next iteration if needed
      
    
      // You can also console.log the created object if needed
      // console.log(alphabetObject);
    }
  
  
    const versionCompare = (a, b) => {
      const versionA = a.split('.').map(Number);
      const versionB = b.split('.').map(Number);
  
      if (versionA[0] !== versionB[0]) {
          return versionA[0] - versionB[0];
      } else {
          return versionA[1] - versionB[1];
      }
  };
  
  // Sorting the object keys based on the version of "id"
  const sortedKeys = Object.keys(itemObject).sort((a, b) => versionCompare(itemObject[a].id, itemObject[b].id));
  
  // Creating a new object with sorted keys
  const sortedItems = {};
  sortedKeys.forEach(key => {
      sortedItems[key] = itemObject[key];
  });
  
   
  
  
    
    // return res.status(500).json({ status: 'Failure' ,error:itemObject });
    if (lastItem) {
      let parts = lastItem.split('.');
      let  minorVersion = parts[1] ? parseInt(parts[1], 10) : 0;
  
      return res.status(200).json({
        status: 'Success',
        items: itemObject,
        input: resultObject,
        alp:alpabetObject,
        intra:interactionBlockObject,
        count: minorVersion,
        maxInput:maxInput,
        serias:parts[0],
        alpacount: alpacount?.qpSecondaryId??null,
        sortedItems:sortedItems
      });
    } else {
  
      
      return res.status(200).json({
        status: 'Success',
        items: itemObject,
        input: resultObject,
        alp:alpabetObject,
        intra:interactionBlockObject,
        count: 1,
        maxInput:maxInput,
        serias:questNos,
        alpacount: alpacount?.qpSecondaryId??null
  
       
      });
    }
  } catch (error) {
    return res.status(500).json({ status: 'Failure' ,error:error.message });
  }
  };
