import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import axios from "axios";
import client from "@/lib/sanity";

type SignUpBody = {
    email: string;
    companyName: string;
    legalCompanyName: string;
    phone: string;
    edrpou: string;
    city: string;
    taxForm: "fop" | "tov" | "other";
    password: string;
    site?: string;

    agencyCrmId?: string;
};

export async function POST(req: Request) {
    let body: SignUpBody;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
    }

    const {
        email,
        companyName,
        legalCompanyName,
        phone,
        edrpou,
        city,
        taxForm,
        password,
        site,
        // agencyCrmId,
    } = body;

    if (
        !email ||
        !companyName ||
        !legalCompanyName ||
        !phone ||
        !edrpou ||
        !city ||
        !taxForm ||
        !password
    ) {
        return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    const existingUser = await client.fetch(
        `*[_type == "agentUser" && email == $email][0]{ _id }`,
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
        _type: "agentUser",
        email,
        companyName,
        legalCompanyName,
        phone,
        edrpou,
        city,
        taxForm,
        site,
        passwordHash,
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
          headers: { "Content-Type": "application/json" },
        }
      );

      const token = tokenResponse.data?.token;
      if (!token) throw new Error("CRM token missing");

      const crmPersonPayload: any = {
        typesex: "company",

        companyname: legalCompanyName,

        externalid: sanityAgent._id,
        findbyArray: ["externalid"],

        phones: [phone],
        addnewphone: true,

        emails: [email],
        addnewemail: true,

        returnwithoutupdate: false,

        customfields: {
          Marketingovanazvaagentsi: companyName,
          DRPOUagentsi: edrpou,
          Mistorestratsi: city,
          Parolsait: password,
          Vebsait: site,
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

    return NextResponse.json({ success: true }, { status: 201 });
}
