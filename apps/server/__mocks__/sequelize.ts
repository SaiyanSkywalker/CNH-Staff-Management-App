import AnnouncementAttributes from "@shared/src/interfaces/AnnouncementAttributes";
import ChannelAttributes from "@shared/src/interfaces/ChannelAttributes";
import DefaultCapacityAttributes from "@shared/src/interfaces/DefaultCapacityAttributes";
import UserInformationAttributes from "@shared/src/interfaces/UserInformationAttributes";
import UnitAttributes from "@shared/src/interfaces/UnitAttributes";
import ShiftCapacityAttributes from "@shared/src/interfaces/ShiftCapacityAttributes";

export const AnnouncementMock = {
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn((query) => {
    const employee: UserInformationAttributes = {
      id: 1,
      employeeId: 50392,
      username: "testUser1",
      firstName: "John",
      lastName: "Doe",
      password: "2024",
    };

    const admin: UserInformationAttributes = {
      id: 2,
      employeeId: 50662,
      username: "testUser3",
      firstName: "Test",
      lastName: "User",
      password: "2024",
    };

    const nurseManager: UserInformationAttributes = {
      id: 3,
      employeeId: 50923,
      username: "nurseManager",
      firstName: "Nurse",
      lastName: "Manager",
      password: "9101",
    };

    if (query["where"]["channelId"] == 1) {
      return Promise.resolve([
        {
          body: "This is announcement",
          sender: employee,
          senderId: 1,
          channelId: 1,
        },
        {
          body: "This is announcement from Admin",
          sender: admin,
          senderId: admin.id,
          channelId: 1,
        },
      ]);
    } else if (query["where"]["channelId"] == 2) {
      return Promise.resolve([
        {
          body: "This is announcement",
          sender: employee,
          senderId: 1,
          channelId: 2,
        },
        {
          body: "This is announcement from Admin",
          sender: admin,
          senderId: admin.id,
          channelId: 2,
        },
        {
          body: "This is announcement from Nurse Manager",
          sender: nurseManager,
          senderId: nurseManager.id,
          channelId: 2,
        },
      ]);
    } else if (query["where"]["channelId"] == 3) {
      return Promise.resolve([
        {
          body: "This is announcement 1",
          sender: employee,
          senderId: 1,
          channelId: 2,
        },
        {
          body: "This is announcement from Admin",
          sender: admin,
          senderId: admin.id,
          channelId: 2,
        },
        {
          body: "This is announcement from Nurse Manager",
          sender: nurseManager,
          senderId: nurseManager.id,
          channelId: 2,
        },
      ]);
    }

    return Promise.reject(null);
  }),
};

export const ChannelMock = {
  findOne: jest.fn((query): Promise<ChannelAttributes | null> => {
    console.dir(query);
    if (query["where"]["id"] == 1) {
      return Promise.resolve({ id: 1, name: "unitRoom", unitRoomId: 1 });
    } else if (query["where"]["id"] == 2) {
      return Promise.resolve({ id: 2, name: "nonUnitRoom", unitRoomId: null });
    } else if (query["where"]["id"] == 3) {
      return Promise.resolve({ id: 3, name: "nonUnitRoom", unitRoomId: 3 });
    } else if (query["where"]["name"] === "existingRoom") {
      return Promise.resolve({ id: 1, name: "existingRoom", unitRoomId: null });
    } else {
      return Promise.resolve(null);
    }
  }),
  create: jest.fn((query): Promise<ChannelAttributes | null> => {
    return Promise.resolve({ id: 2, name: query["name"] });
  }),
  findAll: jest.fn((query) => {
    let channels = [];
    let newChannel: ChannelAttributes = {
      id: 10,
      name: "Non-undefined channel",
      unitRoomId: null,
    };
    let newChannelTwo: ChannelAttributes = {
      id: 20,
      name: "Two Non-undefined channel",
      unitRoomId: null,
    };
    let unitChannel: ChannelAttributes = {
      id: 30,
      name: "Unit Channel",
      unitRoomId: 3,
    };
    let unitTwoChannel: ChannelAttributes = {
      id: 40,
      name: "Unit Two Channel",
      unitRoomId: 4,
    };
    if (!query) {
      channels.push(newChannel);
      channels.push(newChannelTwo);
      channels.push(unitChannel);
      channels.push(unitTwoChannel);
    } else if (query["where"]["unitRoomId"] === null) {
      channels.push(newChannel);
      channels.push(newChannelTwo);
    } else if (query["where"]["unitRoomId"] == 3) {
      channels.push(unitChannel);
    } else if (query["where"]["unitRoomId"] == 4) {
      channels.push(unitTwoChannel);
    }
    return channels;
  }),
};

export const DefaultCapacityMock = {
  records: [],
  findOne: jest.fn((query): Promise<DefaultCapacityAttributes | null> => {
    let defaultCapacityOne: DefaultCapacityAttributes & {
      save: () => Promise<DefaultCapacityAttributes>;
    } = {
      id: 1,
      unitId: 1,
      shift: "15:00 - 19:00",
      capacity: 20,
      save: jest.fn().mockResolvedValue(this),
    };
    let defaultCapacityTwo: DefaultCapacityAttributes & {
      save: () => Promise<DefaultCapacityAttributes>;
    } = {
      id: 2,
      unitId: 1,
      shift: "19:00 - 23:00",
      capacity: 20,
      save: jest.fn().mockResolvedValue(this),
    };
    let defaultCapacityThree: DefaultCapacityAttributes & {
      save: () => Promise<DefaultCapacityAttributes>;
    } = {
      id: 3,
      unitId: 1,
      shift: "23:00 - 03:00",
      capacity: 20,
      save: jest.fn().mockResolvedValue(this),
    };
    let defaultCapacityFour: DefaultCapacityAttributes & {
      save: () => Promise<DefaultCapacityAttributes>;
    } = {
      id: 4,
      unitId: 1,
      shift: "03:00 - 07:00",
      capacity: 20,
      save: jest.fn().mockResolvedValue(this),
    };
    let defaultCapacityFull: DefaultCapacityAttributes & {
      save: () => Promise<DefaultCapacityAttributes>;
    } = {
      id: 5,
      unitId: 1,
      shift: "15:00 - 07:00",
      capacity: 20,
      save: jest.fn().mockResolvedValue(this),
    };

    if (
      query["where"]["shift"] === "15:00 - 07:00" &&
      query["where"]["unitId"] == 1
    ) {
      return Promise.resolve(defaultCapacityFull);
    } else if (
      query["where"]["shift"] === "15:00 - 19:00" &&
      query["where"]["unitId"] == 1
    ) {
      return Promise.resolve(defaultCapacityOne);
    } else if (
      query["where"]["shift"] === "19:00 - 23:00" &&
      query["where"]["unitId"] == 1
    ) {
      return Promise.resolve(defaultCapacityTwo);
    } else if (
      query["where"]["shift"] === "23:00 - 03:00" &&
      query["where"]["unitId"] == 1
    ) {
      return Promise.resolve(defaultCapacityThree);
    } else if (
      query["where"]["shift"] === "03:00 - 07:00" &&
      query["where"]["unitId"] == 1
    ) {
      return Promise.resolve(defaultCapacityFour);
    }

    return Promise.resolve(null);
  }),
  create: jest.fn((query): Promise<DefaultCapacityAttributes | null> => {
    let defaultCapacity: DefaultCapacityAttributes = {
      id: 1,
      unitId: query["unitId"],
      capacity: query["capacity"],
      shift: query["shift"],
    };
    return Promise.resolve(defaultCapacity);
  }),
  findAll: jest.fn((query) => {
    const unit1: UnitAttributes = {
      id: 1,
      laborLevelEntryId: 1,
      name: "ECMO",
      description: "",
    };
    const unit2: UnitAttributes = {
      id: 2,
      laborLevelEntryId: 3,
      name: "NICU",
      description: "",
    };

    let defaultCapacityOne = {
      id: 1,
      unitId: 1,
      unit: unit1,
      shift: "23:00 - 03:00",
      capacity: 40,
    };
    let defaultCapacityTwo = {
      id: 2,
      unitId: 1,
      unit: unit1,
      shift: "03:00 - 07:00",
      capacity: 40,
    };
    let defaultCapacityFull = {
      id: 3,
      unitId: 1,
      unit: unit1,
      shift: "23:00 - 07:00",
      capacity: 40,
    };
    let secondUnitDefaultCapacity = {
      id: 4,
      unitId: 2,
      unit: unit2,
      shift: "03:00 - 07:00",
      capacity: 30,
    };

    if (
      !query ||
      !query["include"] ||
      query["include"].length === 0 ||
      !query["include"][0]["where"] ||
      Object.keys(!query["include"][0]["where"]).length === 0 ||
      !query["include"][0]["where"]["id"]
    ) {
      return Promise.resolve([
        defaultCapacityOne,
        defaultCapacityTwo,
        defaultCapacityFull,
        secondUnitDefaultCapacity,
      ]);
    }

    let id: number = query["include"][0]["where"]["id"];
    if (id === 1) {
      return Promise.resolve([
        defaultCapacityOne,
        defaultCapacityTwo,
        defaultCapacityFull,
      ]);
    } else if (id === 2) {
      return Promise.resolve([secondUnitDefaultCapacity]);
    }
    return Promise.resolve([]);
  }),
  save: jest.fn((): Promise<undefined> => {
    return Promise.resolve(undefined);
  }),
};

export const ShiftCapacityMock = {
  findOne: jest.fn((query): Promise<ShiftCapacityAttributes | null> => {
    let shiftCapacityOne: ShiftCapacityAttributes & {
      save: () => Promise<ShiftCapacityAttributes>;
    } = {
      id: 1,
      unitId: 1,
      shift: "23:00 - 03:00",
      capacity: 40,
      shiftDate: "2024-05-28",
      save: jest.fn().mockResolvedValue(this),
    };
    let shiftCapacityTwo: ShiftCapacityAttributes & {
      save: () => Promise<ShiftCapacityAttributes>;
    } = {
      id: 2,
      unitId: 1,
      shift: "03:00 - 07:00",
      capacity: 40,
      shiftDate: "2024-05-28",
      save: jest.fn().mockResolvedValue(this),
    };
    let shiftCapacityFull: ShiftCapacityAttributes & {
      save: () => Promise<ShiftCapacityAttributes>;
    } = {
      id: 3,
      unitId: 1,
      shift: "23:00 - 07:00",
      capacity: 40,
      shiftDate: "2024-05-28",
      save: jest.fn().mockResolvedValue(this),
    };
    let secondUnitShiftCapacity: ShiftCapacityAttributes & {
      save: () => Promise<ShiftCapacityAttributes>;
    } = {
      id: 4,
      unitId: 2,
      shift: "03:00 - 07:00",
      capacity: 30,
      shiftDate: "2024-05-28",
      save: jest.fn().mockResolvedValue(this),
    };

    if (
      query["where"]["shift"] === shiftCapacityOne.shift &&
      query["where"]["unitId"] == shiftCapacityOne.unitId &&
      query["where"]["shiftDate"] === shiftCapacityOne.shiftDate
    ) {
      return Promise.resolve(shiftCapacityOne);
    } else if (
      query["where"]["shift"] === shiftCapacityTwo.shift &&
      query["where"]["unitId"] == shiftCapacityTwo.unitId &&
      query["where"]["shiftDate"] === shiftCapacityTwo.shiftDate
    ) {
      return Promise.resolve(shiftCapacityTwo);
    } else if (
      query["where"]["shift"] === shiftCapacityFull.shift &&
      query["where"]["unitId"] == shiftCapacityFull.unitId &&
      query["where"]["shiftDate"] === shiftCapacityFull.shiftDate
    ) {
      return Promise.resolve(shiftCapacityFull);
    } else if (
      query["where"]["shift"] === secondUnitShiftCapacity.shift &&
      query["where"]["unitId"] == secondUnitShiftCapacity.unitId &&
      query["where"]["shiftDate"] === secondUnitShiftCapacity.shiftDate
    ) {
      return Promise.resolve(secondUnitShiftCapacity);
    }

    return Promise.resolve(null);
  }),
  create: jest.fn((query): Promise<ShiftCapacityAttributes | null> => {
    let shiftCapacity: ShiftCapacityAttributes = {
      id: 1,
      unitId: query["unitId"],
      capacity: query["capacity"],
      shift: query["shift"],
      shiftDate: query["shiftDate"],
    };
    return Promise.resolve(shiftCapacity);
  }),
  findAll: jest.fn((query) => {
    const unit1: UnitAttributes = {
      id: 1,
      laborLevelEntryId: 1,
      name: "ECMO",
      description: "",
    };
    const unit2: UnitAttributes = {
      id: 2,
      laborLevelEntryId: 3,
      name: "NICU",
      description: "",
    };

    let shiftCapacityOne = {
      id: 1,
      unitId: 1,
      unit: unit1,
      shift: "23:00 - 03:00",
      capacity: 40,
      shiftDate: "2024-05-28",
    };
    let shiftCapacityTwo = {
      id: 2,
      unitId: 1,
      unit: unit1,
      shift: "03:00 - 07:00",
      capacity: 40,
      shiftDate: "2024-05-28",
    };
    let shiftCapacityFull = {
      id: 3,
      unitId: 1,
      unit: unit1,
      shift: "23:00 - 07:00",
      capacity: 40,
      shiftDate: "2024-05-28",
    };
    let secondUnitShiftCapacity = {
      id: 4,
      unitId: 2,
      unit: unit2,
      shift: "03:00 - 07:00",
      capacity: 30,
      shiftDate: "2024-05-28",
    };

    if (
      !query ||
      !query["include"] ||
      query["include"].length === 0 ||
      !query["include"][0]["where"] ||
      Object.keys(!query["include"][0]["where"]).length === 0 ||
      !query["include"][0]["where"]["id"] ||
      Object.keys(!query["where"]).length === 0 ||
      !query["where"]["shiftDate"]
    ) {
      return Promise.resolve([
        shiftCapacityOne,
        shiftCapacityTwo,
        shiftCapacityFull,
        secondUnitShiftCapacity,
      ]);
    }

    let id: number = query["include"][0]["where"]["id"];
    let date: string = query["where"]["shiftDate"];
    if (id === 1 && date === "2024-05-28") {
      return Promise.resolve([
        shiftCapacityOne,
        shiftCapacityTwo,
        shiftCapacityFull,
      ]);
    } else if (id === 2 && date === "2024-05-28") {
      return Promise.resolve([secondUnitShiftCapacity]);
    }
    return Promise.resolve([]);
  }),
  save: jest.fn((): Promise<undefined> => {
    return Promise.resolve(undefined);
  }),
};

export const RoleMock = {
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

export const ScheduleEntryMock = {
  findOne: jest.fn(),
  create: jest.fn(),
};

export const ShiftHistoryMock = {
  findOne: jest.fn(),
  findAll: jest.fn((query) => {
    const user1: UserInformationAttributes = {
      employeeId: 1,
      username: "firstUser",
      firstName: "First",
      lastName: "User",
      password: "1234",
    };
    const user2: UserInformationAttributes = {
      employeeId: 2,
      username: "secondUser",
      firstName: "Second",
      lastName: "User",
      password: "1234",
    };
    const user3: UserInformationAttributes = {
      employeeId: 3,
      username: "thirdUser",
      firstName: "Third",
      lastName: "User",
      password: "1234",
    };
    const user4: UserInformationAttributes = {
      employeeId: 4,
      username: "fourthUser",
      firstName: "Fourth",
      lastName: "User",
      password: "1234",
    };

    const unit1: UnitAttributes = {
      laborLevelEntryId: 1,
      name: "ECMO",
      description: "",
    };
    const unit3: UnitAttributes = {
      laborLevelEntryId: 3,
      name: "NICU",
      description: "",
    };

    const shiftHistory1 = {
      id: 1,
      shiftTime: "07:00 - 11:00",
      status: "Accepted",
      user: user1,
      unit: unit1,
      userId: 1,
      unitId: 1,
      dateRequested: "04/30/2024",
      createdAt: new Date(2024, 3, 30),
    };
    const shiftHistory2 = {
      id: 2,
      shiftTime: "07:00 - 11:00",
      status: "Rejected",
      user: user2,
      unit: unit1,
      userId: 2,
      unitId: 1,
      dateRequested: "05/10/2024",
      createdAt: new Date(2024, 4, 2),
    };
    const shiftHistory3 = {
      id: 3,
      shiftTime: "15:00 - 19:00",
      status: "Accepted",
      user: user3,
      unit: unit3,
      userId: 3,
      unitId: 3,
      dateRequested: "05/11/2024",
      createdAt: new Date(2024, 4, 3),
    };
    const shiftHistory4 = {
      id: 4,
      shiftTime: "15:00 - 19:00",
      status: "Pending",
      user: user1,
      unit: unit1,
      userId: 1,
      unitId: 1,
      dateRequested: "05/11/2024",
      createdAt: new Date(2024, 4, 3),
    };
    const shiftHistory5 = {
      id: 5,
      shiftTime: "19:00 - 23:00",
      status: "Accepted",
      user: user3,
      unit: unit3,
      userId: 3,
      unitId: 3,
      dateRequested: "05/11/2024",
      createdAt: new Date(2024, 4, 3),
    };
    const shiftHistory6 = {
      id: 6,
      shiftTime: "19:00 - 23:00",
      status: "Rejected",
      user: user2,
      unit: unit1,
      userId: 2,
      unitId: 1,
      dateRequested: "05/11/2024",
      createdAt: new Date(2024, 4, 3),
    };
    const shiftHistory7 = {
      id: 7,
      shiftTime: "23:00 - 03:00",
      status: "Accepted",
      user: user3,
      unit: unit3,
      userId: 3,
      unitId: 3,
      dateRequested: "05/12/2024",
      createdAt: new Date(2024, 4, 4),
    };
    const shiftHistory8 = {
      id: 8,
      shiftTime: "23:00 - 03:00",
      status: "Accepted",
      user: user4,
      unit: unit3,
      userId: 4,
      unitId: 3,
      dateRequested: "05/12/2024",
      createdAt: new Date(2024, 4, 4),
    };
    const shiftHistory9 = {
      id: 9,
      shiftTime: "15:00 - 19:00",
      status: "Pending",
      user: user4,
      unit: unit3,
      userId: 4,
      unitId: 3,
      dateRequested: "05/12/2024",
      createdAt: new Date(2024, 4, 5),
    };
    let shiftHistories = [
      shiftHistory1,
      shiftHistory2,
      shiftHistory3,
      shiftHistory4,
      shiftHistory5,
      shiftHistory6,
      shiftHistory7,
      shiftHistory8,
      shiftHistory9,
    ];

    if (query["where"]["shiftTime"]) {
      shiftHistories = shiftHistories.filter(
        (shiftHistory) =>
          shiftHistory["shiftTime"] === query["where"]["shiftTime"]
      );
    }

    if (query["where"]["status"]) {
      shiftHistories = shiftHistories.filter(
        (shiftHistory) => shiftHistory["status"] === query["where"]["status"]
      );
    }

    if (query["where"]["userId"]) {
      shiftHistories = shiftHistories.filter(
        (shiftHistory) => shiftHistory["userId"] == query["where"]["userId"]
      );
    }

    if (query["where"]["unitId"]) {
      shiftHistories = shiftHistories.filter(
        (shiftHistory) => shiftHistory["unitId"] == query["where"]["unitId"]
      );
    }

    if (query["where"]["dateRequested"]) {
      shiftHistories = shiftHistories.filter(
        (shiftHistory) =>
          shiftHistory["dateRequested"] == query["where"]["dateRequested"]
      );
    }
    return Promise.resolve(shiftHistories);
  }),
  create: jest.fn(),
  save: jest.fn(),
};

export const UnitMock = {
  findOne: jest.fn((query) => {
    const unit: UnitAttributes = {
      id: 1,
      laborLevelEntryId: 53040,
      name: query["where"]["name"] ?? "",
      description: "",
    };
    return Promise.resolve(unit);
  }),
  findAll: jest.fn((query) => {
    let units: UnitAttributes[] = [
      { id: 1, laborLevelEntryId: 53040, name: "ECMO", description: "" },
      { id: 2, laborLevelEntryId: 42125, name: "CICU", description: "" },
      { id: 3, laborLevelEntryId: 42150, name: "PICU", description: "" },
    ];
    if (query && query["where"]["id"]) {
      units = units.filter((unit) => unit.id == query["where"]["id"]);
    }
    return Promise.resolve(units);
  }),
  create: jest.fn(),
  save: jest.fn(),
};

export const UserInformationMock = {
  findOne: jest.fn((query): Promise<UserInformationAttributes | null> => {
    // use this for tests where you want to actually get a user
    const user1: UserInformationAttributes & { get: () => Promise<any> } = {
      employeeId: 1,
      username: "firstUser",
      firstName: "First",
      lastName: "User",
      password: "1234",
      get: jest.fn().mockResolvedValue(this),
    };
    console.log("query is:");
    console.dir(query);
    return Promise.resolve(user1);
  }),
  create: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
};

// Mock sequelize functions
export const sequelizeMock = {
  fn: jest.fn(),
  col: jest.fn(),
  where: jest.fn(),
  and: jest.fn(),
};
