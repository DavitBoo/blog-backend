"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const { createClient } = require('@supabase/supabase-js');
exports.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
