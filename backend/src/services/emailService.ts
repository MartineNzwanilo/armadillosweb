
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// --- Templates ---

const STYLES = {
    container: `font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333; border: 1px solid #e5e5e5;`,
    header: `background-color: #0d0d0d; padding: 30px 40px; text-align: center; border-bottom: 4px solid #f59e0b;`, // Black bg, amber border
    brand: `color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 1px; text-decoration: none;`,
    body: `padding: 40px; line-height: 1.6; color: #4a4a4a;`,
    h1: `color: #1a1a1a; font-size: 22px; font-weight: bold; margin-bottom: 20px;`,
    button: `display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #000000; font-weight: bold; text-decoration: none; border-radius: 4px; margin-top: 20px;`,
    footer: `background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee;`,
    link: `color: #f59e0b; text-decoration: none;`
};

const getTemplate = (title: string, contentHtml: string, actionLink?: string, actionText?: string, imageSrc?: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f3f4f6;">
    <div style="${STYLES.container}">
        <!-- Header -->
        <div style="${STYLES.header}">
            <span style="${STYLES.brand}">ARMADILLOS GROUP</span>
        </div>
        
        <!-- Body -->
        <div style="${STYLES.body}">
            ${imageSrc ? `<img src="${imageSrc}" alt="News Image" style="width: 100%; max-width: 600px; height: auto; border-radius: 4px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">` : ''}
            <h1 style="${STYLES.h1}">${title}</h1>
            ${contentHtml}
            
            ${actionLink && actionText ? `
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${actionLink}" style="${STYLES.button}">${actionText}</a>
                </div>
            ` : ''}
        </div>
        
        <!-- Footer -->
        <div style="${STYLES.footer}">
            <p>&copy; ${new Date().getFullYear()} Armadillos Group. All rights reserved.</p>
            <p>You received this email because you subscribed to our newsletter.</p>
            <p>
                <a href="http://localhost:3002" style="${STYLES.link}">Visit Website</a>
            </p>
        </div>
    </div>
</body>
</html>
`;

// --- Service ---

async function getTransporter() {
    const global = await prisma.globalSettings.findFirst();
    // @ts-ignore
    const smtp = global?.smtpConfigJson ? JSON.parse(global.smtpConfigJson) : null;

    if (!smtp || !smtp.user || !smtp.pass) {
        return null;
    }

    return {
        transporter: nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: smtp.user,
                pass: smtp.pass
            }
        }),
        sender: `"${smtp.senderName || 'Armadillos Group'}" <${smtp.user}>`
    };
}

export const emailService = {
    async sendWelcome(email: string) {
        const config = await getTransporter();
        if (!config) return false;

        const html = getTemplate(
            'Welcome to Armadillos Group',
            `
            <p>Thank you for subscribing to our newsletter.</p>
            <p>You will now be the first to know about our latest projects in mining, real estate, and industrial solutions. We are excited to keep you updated with our journey.</p>
            <p>Stay tuned!</p>
            `,
            'http://localhost:3002',
            'Visit Our Website'
        );

        try {
            await config.transporter.sendMail({
                from: config.sender,
                to: email,
                subject: 'Welcome to Armadillos Group',
                html
            });
            return true;
        } catch (e) {
            console.error('Welcome email failed', e);
            return false;
        }
    },

    async sendBroadcast(subscribers: string[], title: string, content: string, link?: string, mediaUrl?: string) {
        const config = await getTransporter();
        if (!config || subscribers.length === 0) return false;

        let imageSrc = undefined;
        const attachments: any[] = [];

        // Handle Image
        if (mediaUrl) {
            let processedUrl = mediaUrl;

            // Check if it's a localhost URL and strip domain to treat as local
            if (processedUrl.includes('localhost') || processedUrl.includes('127.0.0.1')) {
                try {
                    const urlObj = new URL(processedUrl);
                    processedUrl = urlObj.pathname; // e.g. "/uploads/file.png"
                } catch (e) {
                    // Fallback if invalid URL, just use string matching logic if needed
                    // But usually new URL() works.
                }
            }

            if (processedUrl.startsWith('http')) {
                // True Remote URL (e.g. AWS S3, Cloudinary)
                imageSrc = processedUrl;
            } else {
                // Local File - Attach it with CID
                const relativePath = processedUrl.startsWith('/') ? processedUrl.slice(1) : processedUrl;

                // Construct safe path assuming cwd is backend root
                const safePath = path.join(process.cwd(), 'public', relativePath);

                console.log('DEBUG Email Image:', { mediaUrl, processedUrl, relativePath, safePath, cwd: process.cwd(), exists: fs.existsSync(safePath) });

                if (fs.existsSync(safePath)) {
                    const cid = 'news-image-' + Date.now();
                    imageSrc = `cid:${cid}`;
                    attachments.push({
                        filename: path.basename(safePath),
                        path: safePath,
                        cid: cid
                    });
                } else {
                    console.warn(`Email Image not found on disk: ${safePath}`);
                }
            }
        }

        const html = getTemplate(
            title,
            `<p>${content.replace(/\n/g, '<br>')}</p>`,
            link,
            'Read Full Story',
            imageSrc
        );

        try {
            // Using BCC for privacy
            // Note: Attachments increase size. If list is huge, this might be slow/limit hit. 
            // For now acceptable for MVP.
            await config.transporter.sendMail({
                from: config.sender,
                bcc: subscribers,
                subject: `News Update: ${title}`,
                html,
                attachments
            });
            return true;
        } catch (e) {
            console.error('Broadcast failed', e);
            return false;
        }
    }
};
