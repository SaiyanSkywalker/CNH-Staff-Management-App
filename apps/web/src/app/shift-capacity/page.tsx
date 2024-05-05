"use client";

import {
  useState,
  useEffect,
  FormEvent,
  BaseSyntheticEvent,
  useContext,
} from "react";
import UnitAttributes from "@shared/src/interfaces/UnitAttributes";
import styles from "../../styles/ShiftCapacity.module.css";
import config from "web/src/config";
import axios from "axios";
import ShiftCapacityRequest from "@shared/src/interfaces/ShiftCapacityRequest";
import {
  BannerContext,
  BannerContextProps,
} from "@webSrc/contexts/BannerContext";
import {
  LoadingContext,
  LoadingContextProps,
} from "@webSrc/contexts/LoadingContext";

export default function shiftCapacity() {
  const [units, setUnits] = useState<UnitAttributes[]>([]);
  const todayDate = new Date();
  const todayDateString = todayDate.toISOString().substring(0, 10);
  const [capacities, setCapacities] = useState<{ [key: string]: number }>({});
  const [shiftIndex, setShiftIndex] = useState("0");
  const [date, setDate] = useState<string>(todayDateString);
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const bannerContext: BannerContextProps | undefined =
    useContext(BannerContext);
  const loadingContext: LoadingContextProps | undefined =
    useContext(LoadingContext);
  const shifts: string[] = [
    "07:00 - 11:00",
    "07:00 - 15:00",
    "07:00 - 19:00",
    "11:00 - 15:00",
    "11:00 - 19:00",
    "11:00 - 23:00",
    "15:00 - 19:00",
    "15:00 - 23:00",
    "15:00 - 03:00",
    "19:00 - 23:00",
    "19:00 - 03:00",
    "19:00 - 07:00",
    "23:00 - 03:00",
    "23:00 - 07:00",
    "23:00 - 11:00",
  ];

  const getUnits = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${config.apiUrl}/unit`,
        responseType: "json",
      });
      const data = await response.data;
      setInitialLoad(true);
      setUnits(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUnits();
  }, []);

  function handleDateChange(event: BaseSyntheticEvent) {
    const newDateString = event.target.value.substring(0, 10);
    setDate((prevDateString) => newDateString);
  }

  function handleShiftIndexChange(event: BaseSyntheticEvent) {
    setShiftIndex((prevSelectedShift) => event.target.selectedIndex);
  }

  function handleCapacityChange(event: BaseSyntheticEvent) {
    let id: string = event.target.id;
    setCapacities((prevCapacities) => {
      const value = event.target.value;
      // Remove unit from capacities obj if the input value is empty
      if (!value) {
        const { [id]: key, ...otherCapacities } = prevCapacities;
        return { ...otherCapacities };
      } else {
        return { ...prevCapacities, [id]: Number(event.target.value) };
      }
    });
  }

  function handleIsChecked() {
    setIsChecked((prevIsChecked) => !prevIsChecked);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    console.log("date is:");
    console.dir(date);
    try {
      event.preventDefault();
      if (Object.keys(capacities).length === 0) {
        bannerContext?.showBanner(
          "Please define capacities for at least one unit before saving",
          "other"
        );
      } else {
        let shiftCapacityRequest: ShiftCapacityRequest = {
          shiftDate: date,
          shiftTime: shifts[Number(shiftIndex)],
          capacities,
          isDefault: isChecked,
        };
        loadingContext?.showLoader();
        const res = await fetch("http://localhost:3003/shift-capacity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shiftCapacityRequest),
        });
        loadingContext?.hideLoader();
        if (res.status === 200) {
          bannerContext?.showBanner(
            "Success, Shift capacities were successfully saved",
            "success"
          );
        } else {
          bannerContext?.showBanner(
            "Error in saving shift capacities",
            "error"
          );
        }
      }
    } catch (error) {
      loadingContext?.hideLoader();
      bannerContext?.showBanner(
        `Error in saving shift capacities + ${error}`,
        "error"
      );
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.capacity} onSubmit={onSubmit}>
        <h1 className={styles.h1}>Max Unit Capacity</h1>
        <div className="w-[73.5%] my-3">
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="default"
              name="default"
              checked={isChecked}
              onChange={handleIsChecked}
            ></input>
            <label htmlFor="default" className={`${styles.checkboxLabel} ms-2`}>
              Set Defaults
            </label>
          </div>
        </div>
        <div className={styles.grid}>
          {!isChecked && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="widget">
                Date
              </label>
              <input
                className={styles.input}
                value={date}
                onChange={handleDateChange}
                min={todayDate.toISOString().substring(0, 10)}
                name="date"
                id="widget"
                type="date"
                required
              ></input>
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="shift">
              Shift
            </label>
            <select
              className={styles.input}
              value={shiftIndex}
              onChange={handleShiftIndexChange}
              name="shift"
              id="shift"
              required
            >
              {shifts.map((shift, index) => (
                <option value={String(index)} key={index}>
                  {shift}
                </option>
              ))}
            </select>
          </div>

          {units.map((unit, index) => (
            <div className={styles.field} key={index}>
              <label className={styles.label}>{unit.name}</label>
              <input
                className={styles.input}
                id={String(unit.id)}
                onChange={handleCapacityChange}
                name="unit"
                type="number"
                min="0"
                max="100"
              ></input>
            </div>
          ))}
        </div>
        <div
          style={!initialLoad ? { alignSelf: "flex-end" } : {}}
          className={styles.submission}
        >
          <button disabled={!initialLoad} className={styles.button}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
