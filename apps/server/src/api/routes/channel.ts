/**
 * File: channel.ts
 * Purpose: Define the routes used to get data from the Channel table
 */
import { Request, Response, Router } from "express";
import { Op } from "sequelize";
import Announcement from "server/src/models/Announcement";
import Channel from "server/src/models/Channel";
import UserInformation from "server/src/models/UserInformation";

const channelRouter = Router();

// Input: Request, Response
// Output: void.
// Send list of channels back to user or error if server error occurs
channelRouter.get("/", async (req: Request, res: Response) => {
  try {
    let unitIdNum = Number(req.headers["unitid"]);
    let roleIdNum = Number(req.headers["roleid"]);

    console.log(`unitIdNum is ${unitIdNum}, roleIdNum is ${roleIdNum}`);

    if (isNaN(roleIdNum)) {
      res.status(401).json({ error: "Error user needs a role defined!" });
      return;
    }

    if (
      isNaN(unitIdNum) &&
      req.headers["unitid"] !== undefined &&
      req.headers["unitid"] !== null
    ) {
      res.status(401).json({ error: "Unit needs to be a numeric-value!" });
      return;
    }

    if (roleIdNum === 2) {
      let channels = await Channel.findAll();
      //console.log(`channel is ${channels}`)
      res.status(200).send(channels);
      return;
    }

    let createdChannels: Channel[] = await Channel.findAll({
      where: {
        unitRoomId: null,
      },
    });

    let unitChannel: Channel[] = await Channel.findAll({
      where: {
        unitRoomId: unitIdNum,
      },
    });

    let channels = [...unitChannel, ...createdChannels];
    res.status(200).send(channels);
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
    console.log(`id in GET /:id is ${id}`);
    if (isNaN(Number(id))) {
      res.status(400).json({ error: "id needs to be numeric" });
      return;
    }
    let unitIdNum = Number(req.headers["unitid"]);
    let roleIdNum = Number(req.headers["roleid"]);
    let channel = await Channel.findOne({
      where: {
        id,
      },
    });
    if (!channel) {
      res.status(400).json({ error: "Error, room does not exist!" });
    } else if (
      roleIdNum != 2 &&
      channel.unitRoomId != null &&
      channel.unitRoomId != unitIdNum
    ) {
      res.status(401).json({ error: "Error, room is not accessible" });
    } else {
      //console.log("Here I am");
      let announcements: Announcement[] = await Announcement.findAll({
        where: {
          channelId: id,
        },
        include: UserInformation,
      });
      announcements.sort(
        (
          announcementOne: Announcement,
          announcementTwo: Announcement
        ): number => {
          return announcementOne.createdAt < announcementTwo.createdAt ? -1 : 1;
        }
      );
      res.status(200).send(announcements);
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
    console.log(`name is ${name}`);
    if (name === undefined || name === null) {
      res.status(400).json({ error: "Error valid name not provided!" });
      return;
    }
    let channel = await Channel.findOne({
      where: {
        name: name,
      },
    });
    if (channel) {
      res
        .status(400)
        .json({ error: "Error room already exists with given name!" });
    } else {
      console.log("reached channel create");
      let newChannel = await Channel.create({
        name: name,
      });
      console.log("newChannel is:");
      console.dir(newChannel);
      res
        .status(201)
        .json({ success: "Room successfully created!", id: newChannel.id });
    }
  } catch (ex) {
    res.status(500).json({ error: "Error occurred on server!" });
  }
});

export default channelRouter;
