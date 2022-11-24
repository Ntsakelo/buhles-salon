export default function salonBooking(db) {
  async function findStylist(phoneNumber) {
    try {
      let result = await db.oneOrNone(
        "select * from stylist where phone_number = $1",
        [phoneNumber]
      );
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async function findClient(phoneNumber) {
    try {
      let result = await db.oneOrNone(
        "select * from client where phone_number = $1",
        [phoneNumber]
      );
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async function findTreatment(code) {
    try {
      let result = await db.oneOrNone(
        "select * from treatment where code = $1",
        [code]
      );
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async function findAllTreatments() {
    try {
      let result = await db.manyOrNone("select * from treatment");
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async function makeBooking(clientId, treatmentId, stylistId, date, time) {
    try {
      if (!clientId || !treatmentId || !stylistId || !date || !time) {
        return;
      } else {
        let stylistCount = await db.oneOrNone(
          "select count(*) from booking where stylist_id = $1 and booking_date = $2 and booking_time = $3 ",
          [stylistId, date, time]
        );
        if (Number(stylistCount.count) === 1) {
          return;
        }
        let result = await db.oneOrNone(
          "select count(*) from booking where treatment_id = $1 and booking_date = $2 and booking_time = $3 ",
          [treatmentId, date, time]
        );
        if (Number(result.count) >= 2) {
          return;
        }
        await db.none(
          "insert into booking(booking_date,booking_time,client_id,treatment_id,stylist_id) values($1,$2,$3,$4,$5)",
          [date, time, clientId, treatmentId, stylistId]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function findClientBookings(clientId) {
    try {
      let results = await db.manyOrNone(
        "select booking_date,booking_time,client_id,treatment_id,stylist_id from booking where client_id = $1",
        [clientId]
      );
      results.forEach((item) => {
        let day = item.booking_date.getDate();
        let month = item.booking_date.getMonth() + 1;
        let year = item.booking_date.getFullYear();
        item.booking_date = `${day}/${month}/${year}`;
      });
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function findAllBookings(date) {
    try {
      let result = await db.manyOrNone(
        "select * from booking where booking_date = $1",
        [date]
      );
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async function findStylistsForTreatment(treatmentId) {
    try {
      let result = await db.manyOrNone(
        "select first_name from stylist join booking on stylist.id = booking.stylist_id where treatment_id = $1",
        treatmentId
      );
      return result;
    } catch (err) {
      console.log(err);
    }
  }
  async function findBookings(data) {
    try {
      let date = "";
      let time = "";
      if (data.date) {
        date = data.date;
      }
      if (data.time) {
        time = data.time;
      }
      if (date !== "" && time !== "") {
        return await db.manyOrNone(
          "select * from booking where booking_date = $1 and booking_time = $2",
          [date, time]
        );
      }
      if (date !== "" && time === "") {
        return await db.manyOrNone(
          "select * from booking where booking_date = $1",
          [date]
        );
      }
      if (date === "" && time !== "") {
        return await db.manyOrNone(
          "select * from booking where booking_time = $1",
          [time]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function totalIncomeForDay(date) {
    try {
      let result = await db.oneOrNone(
        "select sum(price), booking_date from treatment join booking on treatment.id = booking.treatment_id where booking_date = $1 group by booking_date",
        [date]
      );
      return result;
    } catch (err) {}
  }
  async function mostValuableClient() {
    try {
      let result = await db.manyOrNone(
        "select sum(price),client_id from booking join treatment on booking.treatment_id = treatment.id group by client_id"
      );
      let price = 0;
      let valuableClientId = {};
      result.forEach((item) => {
        if (item.sum > price) {
          price = item.sum;
          valuableClientId = { id: item.client_id };
        }
      });
      let client = await db.oneOrNone(
        "select first_name from client where id = $1",
        [valuableClientId.id]
      );
      return client;
    } catch (err) {
      console.log(err);
    }
  }
  async function deleteFromBookings() {
    try {
      await db.none("delete from booking");
    } catch (err) {
      console.log(err);
    }
  }
  return {
    findStylist,
    findClient,
    findTreatment,
    findAllTreatments,
    makeBooking,
    findClientBookings,
    findAllBookings,
    findStylistsForTreatment,
    findBookings,
    totalIncomeForDay,
    mostValuableClient,
    deleteFromBookings,
  };
}
