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

  return {
    findStylist,
  };
}
