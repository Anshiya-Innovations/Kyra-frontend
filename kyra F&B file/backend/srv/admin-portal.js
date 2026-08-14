export default async function() {
  const { UserManagement } = this.entities;

  // Validate user management requests before write
  this.before('CREATE', 'UserManagement', async (req) => {
    const { name, email } = req.data;
    if (!name) {
      return req.error(400, 'Name is required for administrative user creation', 'name');
    }
    if (!email) {
      return req.error(400, 'Email is required for administrative user creation', 'email');
    }
  });
}
