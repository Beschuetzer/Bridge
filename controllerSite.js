//ExpressJS controller for the non-playing site routes

(User = require("../models/user")),
	(passport = require("passport")),
	(crypto = require("crypto")),
	(nodeMailer = require("nodemailer")),
	(async = require("async")),
	(constants = require("../helpers/constants"));
helpers = require("../controllers/helpers");
defaultColorTheme = "darkBlue";

module.exports.forgotPasswordGet = (req, res) => {
	try {
		res.render("forgotPassword", {});
	} catch {
		console.error("error=", error);
	}
};
module.exports.forgotPasswordPost = (req, res, next) => {
	console.log('forgotPasswordPost------------------------------------------------');
	try {
		async.waterfall(
			[
				//Creates a
				function (done) {
					crypto.randomBytes(20, function (err, buf) {
						const token = buf.toString("hex");
						done(err, token);
					});
				},
				function (token, done) {
					User.findOne({ email: req.body.email }, (err, user) => {
						if (!user) {
							req.flash(
								"error",
								`No Account with the email '${req.body.email}' exists.`,
							);
							return res.redirect("/forgotPassword");
						} else if (err) {
							req.flash("error", `Error retrieving email.  Try again.`);
						}
						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + 3600000; //in MS
						user.save((err) => {
							if (err) {
								req.flash("error", `Error saving User`);
								return res.redirect("/forgotPassword");
							}
							done(err, token, user);
						});
					});
				},
				function (token, user, done) {
					const smtpTransport = nodeMailer.createTransport({
						service: "Outlook",
						auth: {
							user: process.env.EMAIL_ACCOUNT,
							pass: process.env.EMAIL_PASSWORD,
						},
					});
					const mailOptions = {
						to: user.email,
						from: `${process.env.EMAIL_ACCOUNT}`,
						subject: "Reset Password to Your A#Maj Bridge Account",
						text: `You are receiving this because you (or someone else) have requested a password reset to your Bridge account.  Please click on the following link, or paste this into your browser to complete the process.\n\nhttp://${req.headers.host}/resetPassword/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`,
					};
					smtpTransport.sendMail(mailOptions, (err) => {
						console.log("mail sent");
						req.flash(
							"success",
							`An e-mail has been sent to ${user.email} with further instructions.`,
						);
						done(err, "done");
					});
				},
			],
			(err) => {
				if (err) return next(err);
				res.redirect("/login");
			},
		);
	} catch {
		console.error("error=", error);
	}
};
module.exports.resetPasswordGet = async (req, res) => {
	try {
		console.log(req.params.token);
		const user = await User.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() },
		});
		if (!user) {
			req.flash("error", `Password Reset token is invalid or has expired.`);
			return res.redirect("/forgotPassword");
		}
		return res.render("resetPassword", { token: req.params.token });
	} catch (error) {
		req.flash("error", `Error encountered getting user: $\n{error}.`);
		return res.redirect("/forgotPassword");
	}
};
module.exports.resetPasswordPost = async (req, res) => {
	console.log('resetPasswordPost------------------------------------------------');
	try {
		console.log(req.params.token);
		console.log(req.params.password);
		console.log(req.params.passwordConfirmed);
		if (req.body.password !== req.body.passwordConfirmed) {
			req.flash("error", `The passwords do not match.  Try again.`);
			return res.redirect(`/resetPassword/${req.params.token}`);
		}
		const user = await User.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() },
		});
		if (!user) {
			req.flash("error", `Password Reset token is invalid or has expired.`);
			return res.redirect("/forgotPassword");
		}
		try {
			await user.setPassword(req.body.password);
			user.resetPasswordExpires = undefined;
			user.resetPasswordToken = undefined;
			await user.save((err) => {
				if (err) {
					req.flash("error", `Error saving new Password.`);
					return res.redirect("/resetPassword");
				}
			});
		} catch (error) {
			req.flash(
				"error",
				`Something went wrong saving the new password.  Try again.`,
			);
			return res.redirect("/forgotPassword");
		}
		//sends an email using nodeMailer
		const smtpTransport = nodeMailer.createTransport({
			service: "Outlook",
			auth: {
				user: process.env.EMAIL_ACCOUNT,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
		const mailOptions = {
			to: user.email,
			from: `${process.env.EMAIL_ACCOUNT}`,
			subject: "Your A#Maj Bridge Password has been Changed",
			text: `This is a confirmation that your A#Maj Bridge password has been changed for the account associated with the email ${user.email}.\n\nIf you did not reset your password then you may have been hacked.`,
		};
		smtpTransport.sendMail(mailOptions, (err) => {
			if (err) {
				console.log("Password reset confirmation email failed...");
			}
			req.flash("success", `Success!  Your password has been changed.`);
			res.redirect("/login");
		});
	} catch {
		console.error("error=", error);
	}
};
module.exports.loginGet = function (req, res) {
	try {
		console.log("req.query.incorrectPassword =", req.query.incorrectPassword);
		if (req.query.incorrectPassword) {
			req.flash("error", `Incorrect Password`);
		}
		res.render("login", {});
	} catch {
		console.error("error=", error);
	}
};
(module.exports.loginPost = passport.authenticate("local", {
	successRedirect: "/start?loginSuccess=true",
	failureRedirect: "/login?incorrectPassword=true",
	failureFlash: true,
})), function (req, res) {};
module.exports.profileGet = async (req, res) => {
	try {
		if (!res.locals.currentUser) {
			req.flash("error", `Please Login In.`);
			return res.redirect("/login");
		}
		try {
			const userObj = await User.findOne({
				username: res.locals.currentUser.username,
			});
			return res.render("profile", { userObj });
		} catch (error) {
			console.log(
				"error getting user for profile------------------------------------------------",
			);
			console.error("error =", error);
			return res.render("start", {});
		}
	} catch {
		console.error("error=", error);
	}
};
module.exports.profilePost = async (req, res) => {
	if (!res.locals.currentUser) return res.redirect("/login");
	try {
		const userObj = await User.findById(req.body.id);
		if (
			userObj.authenticate(
				req.body.password,
				async (err, user, passwordError) => {
					if (passwordError) {
						req.flash("error", `Incorrect Password.  Try Again.`);
						res.redirect("/profile");
					} else {
						try {
							const users = await User.find({});
							const isUnique = helpers.getIsUnique(users, req);
							if (isUnique === -1) {
								req.flash("error", `'${req.body.username}' is already taken`);
								return res.redirect("/profile");
							} else if (isUnique === -2) {
								req.flash("error", `'${req.body.email}' is already taken`);
								return res.redirect("/profile");
							}
							const newUserObj = await User.findByIdAndUpdate(req.body.id, {
								username: req.body.username,
								email: req.body.email,
							});

							if (newUserObj.username !== req.body.username) {
								req.flash(
									"success",
									`username changed to '${req.body.username}'. Login with '${req.body.username}'.`,
								);
								return res.redirect("/login");
							} else {
								req.flash("success", `Profile Update Successful.`);
								return res.redirect("/profile");
							}
						} catch (error) {
							console.log(
								"error saving newuserObj in /profile post------------------------------------------------",
							);
							console.error("error =", error);
						}
					}
				},
			)
		);
	} catch (error) {
		console.log(
			"error getting user obj in /profile post------------------------------------------------",
		);
	}
};
module.exports.registerGet = (req, res) => {
	try {
		if (req.query.invalidUser) {
			req.flash("error", `You need to create an account to play games.`);
		} else if (req.query.username) {
			req.flash("error", `'${req.query.username}' is not a registered user.`);
		}
		res.render("register", {});
	} catch {
		console.error("error=", error);
	}
};
module.exports.registerPost = async (req, res) => {
	try {
		//make sure passwords match
		console.log("req.body.password =", req.body.password);
		console.log("req.body.reEnterPassword =", req.body.reEnterPassword);
		if (req.body.password !== req.body.reEnterPassword) {
			req.flash("error", `Passwords do no match.`);
			return res.redirect(
				`/register?username=${req.body.username}&email=${req.body.email}`,
			);
		}

		//make sure email is unique
		const users = await User.find({});
		const isUnique = helpers.getIsUnique(users, req);
		if (isUnique === -1) {
			req.flash(
				"error",
				`The username ${req.body.username} is already being used by another account.`,
			);
			return res.redirect(
				`/register?username=${req.body.username}&email=invalid`,
			);
		}
		if (isUnique === -2) {
			req.flash(
				"error",
				`The email ${req.body.email} is already being used by another account.`,
			);
			return res.redirect(
				`/register?username=${req.body.username}&email=invalid`,
			);
		}

		try {
			const user = await User.register(
				new User({
					username: req.body.username,
					email: req.body.email,
				}),
				req.body.password,
			);

			passport.authenticate("local")(req, res, function () {
				//Do something when authenticated
				req.flash("success", `Welcome to A#Maj Bridge ${req.body.username}!`);
				res.redirect("/start");
			});
		} catch (err) {
			if (err || !user) {
				req.flash("error", `${err.message}`);
				res.redirect(`/register?username=invalid&email=${req.body.email}`);
			}
		}
	} catch (error) {
		console.error("error=", error);
	}
};
module.exports.preferencesGet = async (req, res) => {
	try {
		let userObj;
		if (!res.locals.currentUser || !res.locals.currentUser.username) {
			req.flash("error", "Login to Change Preferences");
			res.redirect("/login");
			return;
		}

		try {
			userObj = await User.findOne({
				username: res.locals.currentUser.username,
			});
		} catch (error) {
			console.log(
				`Error getting preferences for users in route /preferences------------------------------------------------`,
			);
		}
		res.render("preferences", {
			preferences: userObj.preferences,
			sounds: constants.sounds,
			soundPreferenceOptions: constants.soundEventOptions,
			preferenceOptions: constants.preferenceOptions,
			colorThemes: constants.colorThemes,
		});
	} catch {
		console.error("error=", error);
	}
};
module.exports.preferencesPost = async (req, res) => {
	try {
		console.log(
			"req.body.setHonorsAutomatically =",
			req.body.setHonorsAutomatically,
		);
		const objToUse = {
			preferences: {
				sound: {
					isEnabled: req.body.isEnabled,
					defaultVolume: req.body.defaultVolume,
					isYourTurnHand: req.body.isYourTurnHand,
					isYourTurnExposed: req.body.isYourTurnExposed,
					userPlaysCard: req.body.userPlaysCard,
					cardPlayDuring: req.body.cardPlayDuring,
					invalidCardPlayed: req.body.invalidCardPlayed,
					roundEndAnimation: req.body.roundEndAnimation,
					roundWon: req.body.roundWon,
					dealSummaryWon: req.body.dealSummaryWon,
					dealSummaryLost: req.body.dealSummaryLost,
					gameSummaryWon: req.body.gameSummaryWon,
					gameSummaryLost: req.body.gameSummaryLost,
				},
				cardSortPreference: req.body.cardSortPreference,
				suitSortPreference: req.body.suitSortPreference,
				trumpOnLeftHand: req.body.trumpOnLeftHand,
				trumpOnLeftExposedHand: req.body.trumpOnLeftExposedHand,
				shouldAnimateThinkingForSelf: req.body.shouldAnimateThinkingForSelf,
				shouldAnimateCardPlay: req.body.shouldAnimateCardPlay,
				shouldAnimateRoundEnd: req.body.shouldAnimateRoundEnd,
				pointCountingConvention: req.body.pointCountingConvention,
				cardBackPreference: req.body.cardBackPreference,
				colorPreference: req.body.colorPreference,
				colorTheme: req.body.colorTheme,
				setHonorsAutomatically: req.body.setHonorsAutomatically,
			},
		};
		await User.updateOne(
			{ username: res.locals.currentUser.username },
			objToUse,
		);
	} catch (error) {
		req.flash("error", `Error Saving.  Try Again.`);
		console.log(
			"error Saving preferences------------------------------------------------",
		);
		console.error("error =", error);
	}
	req.flash("success", `Preferences Saved Successfully`);
	res.redirect("/preferences");
};
module.exports.privacyPolicy = (req, res) => {
	res.render("privacyPolicy.ejs", {});
};
module.exports.logout = function (req, res) {
	req.logout(); //passport's logout()
	req.flash("success", "Successfully Logged Out!");
	res.redirect("/");
};
module.exports.landing = (req, res) => {
	res.render("landing", {});
};
