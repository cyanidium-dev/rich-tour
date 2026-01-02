import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import axios from "axios";
import client from "@/lib/sanity";

type SignUpBody = {
    email: string;
    phone: string;
    password: string;

    firstName: string;
    lastName: string;
    middleName?: string;

    site?: string;
    license?: string;
    country?: string;
    city?: string;

    agencyCrmId?: string;
};

export async function POST(req: Request) {
    let body: SignUpBody;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "INVALID_BODY" },
            { status: 400 }
        );
    }

    const {
        email,
        phone,
        password,
        firstName,
        lastName,
        middleName,
        site,
        license,
        country,
        city,
        agencyCrmId,
    } = body;

    if (!email || !phone || !password || !firstName || !lastName) {
        return NextResponse.json(
            { error: "MISSING_FIELDS" },
            { status: 400 }
        );
    }

    const existingUser = await client.fetch(
        `*[_type == "companyUser" && email == $email][0]{ _id }`,
        { email }
    );

    if (existingUser) {
        return NextResponse.json(
            { error: "USER_ALREADY_EXISTS" },
            { status: 409 }
        );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const sanityAgent = await client.create({
        _type: "companyUser",

        email,
        phone,
        passwordHash,

        firstName,
        lastName,
        middleName,

        site,
        license,
        country,
        city,
    });

    /*
    try {
      const tokenResponse = await axios.post(
        process.env.CRM_TOKEN_URL!,
        {
          login: process.env.CRM_LOGIN,
          restapipassword: process.env.CRM_REST_API_PASSWORD,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = tokenResponse.data?.token;
      if (!token) throw new Error("CRM token missing");

      const crmPersonPayload: any = {
        typesex: "person",

        name: firstName,
        namelast: lastName,
        namemiddle: middleName,

        externalid: sanityAgent._id,
        findbyArray: ["externalid"],

        phones: [phone],
        addnewphone: true,

        emails: [email],
        addnewemail: true,

        returnwithoutupdate: false,

        customfields: {
          Vebsait: site,
          Litsenziya: license,
          Krana: country,
          Misto: city,
          Parolsait: password,
        },
      };

      if (agencyCrmId) {
        crmPersonPayload.companys = [agencyCrmId];
      }

      await axios.post(
        process.env.CRM_ORDER_SET_URL!,
        [crmPersonPayload],
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
    */

    return NextResponse.json(
        { success: true },
        { status: 201 }
    );
}
