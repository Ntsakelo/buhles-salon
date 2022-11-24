import assert from "assert";
import SalonBooking from "../salon-booking.js";
import pgPromise from "pg-promise";

// TODO configure this to work.
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://coder:pg123@localhost:5432/buhles_salon";

const config = {
  connectionString: DATABASE_URL,
};

const pgp = pgPromise();
const db = pgp(config);

let booking = SalonBooking(db);

describe("The Booking Salon", function () {
  beforeEach(async function () {
    await db.none(`delete from booking`);
  });

  it("should be able to list treatments", async function () {
    try {
      const treatments = await booking.findAllTreatments();
      assert.equal(4, treatments.length);
    } catch (err) {
      console.log(err);
    }
  });

  it("should be able to find a stylist", async function () {
    try {
      const stylist = await booking.findStylist("0671231342");
      assert.equal("Buhle", stylist.first_name);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to find a client", async function () {
    try {
      const client = await booking.findClient("0726541234");
      assert.deepEqual("Thanyani", client.first_name);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to find a treatment", async function () {
    try {
      const treatment = await booking.findTreatment("P01");
      assert.equal("Pedicure", treatment.type);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to allow a client to make a booking", async function () {
    try {
      const client = await booking.findClient("0820701111");
      const treatment = await booking.findTreatment("M03");
      const stylist = await booking.findStylist("0817878111");
      await booking.makeBooking(
        client.id,
        treatment.id,
        stylist.id,
        "2022-11-24",
        "14:00"
      );

      const bookings = await booking.findClientBookings(client.id);
      assert.deepEqual(
        [
          {
            booking_date: "24/11/2022",
            booking_time: "14:00:00",
            client_id: client.id,
            treatment_id: treatment.id,
            stylist_id: stylist.id,
          },
        ],
        bookings
      );
    } catch (err) {
      console.log(err);
    }
  });

  it("should be able to get client booking(s)", async function () {
    const client1 = await booking.findClient("0792516711");
    const client2 = await booking.findClient("0691905454");
    const client3 = await booking.findClient("0820701111");

    const treatment1 = await booking.findTreatment("B04");
    const treatment2 = await booking.findTreatment("M03");

    const stylist = await booking.findStylist("0720701211");
    const stylist2 = await booking.findStylist("0817878111");
    const stylist3 = await booking.findStylist("0671231342");

    await booking.makeBooking(
      client1.id,
      treatment1.id,
      stylist.id,
      "2022-11-24",
      "14:00"
    );
    await booking.makeBooking(
      client1.id,
      treatment1.id,
      stylist2.id,
      "2022-11-24",
      "14:00"
    );
    await booking.makeBooking(
      client1.id,
      treatment1.id,
      stylist3.id,
      "2022-11-24",
      "14:00"
    );

    const bookings = await booking.findAllBookings("2022-11-24");

    assert.equal(2, bookings.length);
  });
  it("should be able to get stylists that ever gave the treatment", async function () {
    try {
      const client = await booking.findClient("0691905454");

      const treatment = await booking.findTreatment("B04");

      const stylist = await booking.findStylist("0791110911");
      const stylist2 = await booking.findStylist("0817878111");

      await booking.makeBooking(
        client.id,
        treatment.id,
        stylist.id,
        "2022-11-24",
        "14:00"
      );
      await booking.makeBooking(
        client.id,
        treatment.id,
        stylist2.id,
        "2022-11-25",
        "16:00"
      );

      const treatmentStylist = await booking.findStylistsForTreatment(
        treatment.id
      );

      assert.deepEqual(
        [{ first_name: "Lefa" }, { first_name: "Nthabi" }],
        treatmentStylist
      );
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to get bookings for a date", async function () {
    const client1 = await booking.findClient("0710991234");
    const client2 = await booking.findClient("0817876432");
    const client3 = await booking.findClient("0820701111");

    const treatment1 = await booking.findTreatment("P01");
    const treatment2 = await booking.findTreatment("B04");

    const stylist = await booking.findStylist("0817878111");
    const stylist2 = await booking.findStylist("0791110911");

    await booking.makeBooking(
      client1.id,
      treatment1.id,
      stylist.id,
      "2022-11-24",
      "16:00"
    );
    await booking.makeBooking(
      client1.id,
      treatment1.id,
      stylist.id,
      "2022-11-24",
      "16:00"
    );
    await booking.makeBooking(
      client3.id,
      treatment2.id,
      stylist2.id,
      "2022-11-25",
      "16:00"
    );
    let data = { time: "16:00", date: "2022-11-25" };
    const bookings = await booking.findBookings(data);

    assert.equal(1, bookings.length);
  });

  it("should be able to find the total income for a day", async function () {
    try {
      const client1 = await booking.findClient("0710991234");
      const client2 = await booking.findClient("0820701111");

      const treatment1 = await booking.findTreatment("P01");
      const treatment2 = await booking.findTreatment("B04");

      const stylist = await booking.findStylist("0817878111");
      const stylist2 = await booking.findStylist("0791110911");

      await booking.makeBooking(
        client1.id,
        treatment1.id,
        stylist.id,
        "2022-11-25",
        "16:00"
      );
      await booking.makeBooking(
        client2.id,
        treatment2.id,
        stylist2.id,
        "2022-11-25",
        "16:00"
      );
      const amount = await booking.totalIncomeForDay("2022-11-25");

      assert.equal(415, amount.sum);
    } catch (err) {
      console.log(err);
    }
  });

  it("should be able to find the most valuable client", async function () {
    try {
      const client1 = await booking.findClient("0710991234");
      const client2 = await booking.findClient("0820701111");

      const treatment1 = await booking.findTreatment("P01");
      const treatment2 = await booking.findTreatment("B04");

      const stylist = await booking.findStylist("0817878111");
      const stylist2 = await booking.findStylist("0791110911");

      await booking.makeBooking(
        client1.id,
        treatment1.id,
        stylist.id,
        "2022-11-25",
        "16:00"
      );
      await booking.makeBooking(
        client2.id,
        treatment2.id,
        stylist2.id,
        "2022-11-25",
        "16:00"
      );
      await booking.makeBooking(
        client2.id,
        treatment1.id,
        stylist2.id,
        "2022-11-27",
        "16:00"
      );
      const bestClient = await booking.mostValuableClient();
      assert.equal("Dzunisani", bestClient.first_name);
    } catch (err) {
      console.log(err);
    }
  });
  //   it("should be able to find the total commission for a given stylist", function () {
  //     assert.equal(1, 2);
  //   });

  after(function () {
    db.$pool.end();
  });
});
