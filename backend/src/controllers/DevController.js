const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const {findConnections, sendMessage} = require('../websocket')



module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
        const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
        const { name = github_username, avatar_url, bio } = apiResponse.data;
        
        const techsArray = parseStringAsArray(techs)
        
    
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        }
    
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })
    
            // Filtrar as conexões que estão a no máximo 10km de distância
            // e que o novo dev tenha pelo menos uma das tecnologias filtradas
            const sendSocketMessageTo = findConnections(
              { latitude, longitude }, 
              techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev)

        }
    
            return response.json(dev);
    },

    async update(request, response) {
        const { id } = request.params;
        let { techs, latitude, longitude, ...dataToUpdate } = request.body;
        
        if (dataToUpdate.github_username) 
          delete dataToUpdate.github_username 
    
        if (longitude && latitude)
          dataToUpdate.location = {
            type: "Point",
            coordinates: [longitude, latitude]
          };
    
        if (techs)
          dataToUpdate.techs = parseStringAsArray(techs);
    
        const dev = await Dev.findByIdAndUpdate(id, dataToUpdate, { new: true });
    
        return response.json(dev);
      },
    
      async destroy(request, response) {
        const { id } = request.params;
    
        await Dev.findByIdAndDelete(id);
    
        return response.json({ message: "Apagado com sucesso" });
      }


};