import { Request, Response, Router } from "express";
import { Op } from "sequelize";
import Announcement from "server/src/models/Announcement";
import Channel from "server/src/models/Channel";

const channelRouter = Router();

// Input: Request, Response
// Output: void. 
// Send list of channels back to user or error if server error occurs
channelRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { unitId } = req.body
    const channels: Channel[] = await Channel.findAll({
        where: {
            unitRoomId: {
                [Op.or]: unitId ? [null, unitId] : []   
            }
        }
    });
    res.send(channels);
  } catch (ex) {
    res.status(500).json({ error: "Error occurred on server!" });
  }
});

// Input: Request, Response
// Output: void. 
// Take in id and return messages associated with channel id. Raise error for bad requests or unauthorized access or server error
channelRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { unitId } = req.body;
    let channel = await Channel.findOne({
        where: {
            unitRoomId: id
        }
    });
    if(!channel) {
        res.status(400).json({ error: "Error, room does not exist!" });
    }
    else if(unitId != null && channel.unitRoomId != null && channel.unitRoomId != unitId) {
        res.status(401).json({ error: "Error, room is not accessible" });
    }
    else {
        let announcements: Announcement[] = await Announcement.findAll({
            where: {
                channelId: id
            }
        });
        announcements.sort((announcementOne: Announcement, announcementTwo: Announcement): number => {
            return announcementOne.createdAt < announcementTwo.createdAt ? -1 : 1
        })
        res.send(announcements);
    }
  } catch (ex) {
        res.status(500).json({ error: "Error occurred on server!" });
  }
});


// Input: Request, Response
// Output: void. 
// Used to create a new channel, so long as it does not previously exist.
channelRouter.post("/", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        let lowercasedName: string = name.toLowerCase();
        let channel = await Channel.findOne({
            where: {
                name: name
            }
        });
        if(channel) {
            res.status(400).json({ error: "Error room already exists with given name!" });
        }
        else {
            await Channel.create({
                name: name,
            });
            res.status(201).json({ success: "Room successfully created!" });
        }
    }
    catch (ex) {
        res.status(500).json({ error: "Error occurred on server!" });
    }
})

export default channelRouter;
