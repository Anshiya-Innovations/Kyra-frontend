export default async function() {
  const { Profile } = this.entities;

  // Validate profile info before creation
  this.before('CREATE', 'Profile', async (req) => {
    const { name, email } = req.data;
    if (!name) {
      return req.error(400, 'Name is required', 'name');
    }
    if (!email) {
      return req.error(400, 'Email is required', 'email');
    }
  });
}
