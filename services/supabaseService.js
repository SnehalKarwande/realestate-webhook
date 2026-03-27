const { createClient } = require("@supabase/supabase-js");

// Initialise once at module load — credentials come from environment
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/**
 * Insert a new lead into the `leads` table.
 *
 * @param {string} name         - Lead's full name
 * @param {string} phoneNumber  - Lead's phone number (provided by user)
 * @returns {Promise<object>}   - Inserted row
 */
async function saveLead(name, phoneNumber) {
  const { data, error } = await supabase
    .from("leads")
    .insert([
      {
        name,
        phone_number: phoneNumber,
        source: "whatsapp",
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
  return data;
}

module.exports = { saveLead };
