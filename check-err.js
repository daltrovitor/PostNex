const mailchimp = require("@mailchimp/mailchimp_marketing");
try {
    mailchimp.setConfig({});
} catch (e) {
    console.log("Mailchimp error", e.message);
}

const Stripe = require("stripe");
try {
    new Stripe();
} catch (e) {
    console.log("Stripe error", e.message);
}

const { createClient } = require("@supabase/supabase-js");
try {
    createClient();
} catch (e) {
    console.log("Supabase error", e.message);
}

