export default ($db: any) =>
	$db.Model('Message', {
		text: String,
		from: String,
		to: String,
		isDeleted: Boolean,
	})
