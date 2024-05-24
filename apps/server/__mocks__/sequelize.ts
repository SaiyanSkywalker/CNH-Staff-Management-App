import AnnouncementAttributes from "@shared/src/interfaces/AnnouncementAttributes";
import ChannelAttributes from "@shared/src/interfaces/ChannelAttributes";
import UserInformationAttributes from "@shared/src/interfaces/UserInformationAttributes";
import { Op } from 'sequelize';
import UserInformation from "server/src/models/UserInformation";

export const AnnouncementMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(( query ) => {
        const employee: UserInformationAttributes = {
            id: 1,
            employeeId: 50392,
            username: 'testUser1',
            firstName: 'John',
            lastName: 'Doe',
            password: '2024'
        }

        const admin: UserInformationAttributes = {
            id: 2,
            employeeId: 50662,
            username: 'testUser3',
            firstName: 'Test',
            lastName: 'User',
            password: '2024'
        }

        const nurseManager: UserInformationAttributes = {
            id: 3,
            employeeId: 50923,
            username: 'nurseManager',
            firstName: 'Nurse',
            lastName: 'Manager',
            password: '9101'
        }
        
        if (query['where']['channelId'] == 1) {
            return Promise.resolve([{ body: "This is announcement", sender: employee, senderId: 1, channelId: 1  }, { body: "This is announcement from Admin", sender: admin, senderId: admin.id, channelId: 1  }])
        }
        else if (query['where']['channelId'] == 2) {
            return Promise.resolve([{ body: "This is announcement", sender: employee, senderId: 1, channelId: 2  }, { body: "This is announcement from Admin", sender: admin, senderId: admin.id, channelId: 2  }, { body: "This is announcement from Nurse Manager", sender: nurseManager, senderId: nurseManager.id, channelId: 2  }])
        }
        else if (query['where']['channelId'] == 3) {
            return Promise.resolve([{ body: "This is announcement 1", sender: employee, senderId: 1, channelId: 2  }, { body: "This is announcement from Admin", sender: admin, senderId: admin.id, channelId: 2  }, { body: "This is announcement from Nurse Manager", sender: nurseManager, senderId: nurseManager.id, channelId: 2  }])   
        }

        return Promise.reject(null);
    })
};

export const ChannelMock = {
    findOne: jest.fn(( query ): Promise<ChannelAttributes | null> => {
        console.log("query is:");
        console.dir(query);
        console.log(`query['where'] is ${query['where']}`);
        console.log(`query['where']['id'] is ${query['where']['id']}`);
        console.log(`query['where']['name'] is ${query['where']['name']}`);
        console.log("Reached ChannelMock!");
        if (query['where']['id'] == 1) {
            return Promise.resolve({ id: 1, name: "unitRoom", unitRoomId: 1 });
        }
        else if (query['where']['id'] == 2) {
            return Promise.resolve({ id: 2, name: "nonUnitRoom", unitRoomId: null });
        }
        else if (query['where']['id'] == 3) {
            return Promise.resolve({ id: 3, name: "nonUnitRoom", unitRoomId: 3 });
        }
        else if (query['where']['name'] === "existingRoom") {
            return Promise.resolve({ id: 1, name: "existingRoom", unitRoomId: null });
        } else {
            return Promise.resolve(null);
        }  
    }),
    create: jest.fn(( query ): Promise<ChannelAttributes | null>  => {
        return Promise.resolve({ id: 2, name: query['name'] });
    }),
    findAll: jest.fn((query) => {
        console.log(`query is:`);
        console.dir(query);
        let channels = [];
        let newChannel: ChannelAttributes = { id: 10, name: 'Non-undefined channel', unitRoomId: null };
        let newChannelTwo: ChannelAttributes = { id: 20, name: 'Two Non-undefined channel', unitRoomId: null };
        let unitChannel: ChannelAttributes = {id: 30, name: 'Unit Channel', unitRoomId: 3}
        let unitTwoChannel: ChannelAttributes = {id: 40, name: 'Unit Two Channel', unitRoomId: 4}
        if(!query) {
            channels.push(newChannel);
            channels.push(newChannelTwo);
            channels.push(unitChannel);
            channels.push(unitTwoChannel);
        }
        else if(query['where']['unitRoomId'] === null) {
            channels.push(newChannel);
            channels.push(newChannelTwo);
        }
        else if(query['where']['unitRoomId'] == 3) {
            channels.push(unitChannel);
        }
        else if(query['where']['unitRoomId'] == 4) {
            channels.push(unitTwoChannel);
        }
        return channels;
    })
};

export const DefaultCapacityMock = {
    findOne: jest.fn(),
    create: jest.fn()
};

export const ShiftCapacityMock = {
    findOne: jest.fn(),
    create: jest.fn()
};

export const RoleMock = {
    findOne: jest.fn(),
    create: jest.fn()
};

export const ScheduleEntryMock = {
    findOne: jest.fn(),
    create: jest.fn()
};


export const ShiftHistoryMock = {
    findOne: jest.fn(),
    create: jest.fn()
};

export const UnitMock = {
    findOne: jest.fn(),
    create: jest.fn()
};

export const UserInformationMock = {
    findOne: jest.fn(),
    create: jest.fn()
};

