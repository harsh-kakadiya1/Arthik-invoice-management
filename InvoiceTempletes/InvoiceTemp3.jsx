import React from "react";
import { InvoiceLayout } from "@/app/components";
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";
import { DATE_OPTIONS } from "@/lib/variables";
import { InvoiceType } from "@/types";

const InvoiceTemplate3 = (data) => {
    const { sender, receiver, details } = data;
    return (
        <InvoiceLayout data={data}>
            {/* Header Section */}
            <div className="bg-blue-700 text-white p-6 rounded-t-lg flex justify-between items-center">
                <div>
                    {details.invoiceLogo && (
                        <img
                            src={details.invoiceLogo}
                            width={120}
                            height={80}
                            alt={`Logo of ${sender.name}`}
                            className="mb-2"
                        />
                    )}
                    <h1 className="text-3xl font-bold">{sender.name}</h1>
                    <p className="text-sm opacity-90">{sender.address}, {sender.city}, {sender.zipCode}, {sender.country}</p>
                    <p className="text-sm opacity-90">{sender.email} | {sender.phone}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-extrabold">INVOICE</h2>
                    <p className="text-xl mt-1">#{details.invoiceNumber}</p>
                </div>
            </div>

            {/* Dates & Bill To/From */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 border-b border-gray-200">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Invoice Details:</h3>
                    <dl className="space-y-1">
                        <div className="flex justify-between">
                            <dt className="font-medium text-gray-600">Invoice Date:</dt>
                            <dd className="text-gray-800">
                                {new Date(details.invoiceDate).toLocaleDateString("en-US", DATE_OPTIONS)}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="font-medium text-gray-600">Due Date:</dt>
                            <dd className="text-gray-800">
                                {new Date(details.dueDate).toLocaleDateString("en-US", DATE_OPTIONS)}
                            </dd>
                        </div>
                    </dl>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Bill To:</h3>
                    <h4 className="font-bold text-gray-800">{receiver.name}</h4>
                    <address className="not-italic text-gray-600 text-sm">
                        {receiver.address}
                        <br />
                        {receiver.zipCode}, {receiver.city}
                        <br />
                        {receiver.country}
                    </address>
                </div>
            </div>

            {/* Items Table */}
            <div className="p-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate ({details.currency})</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount ({details.currency})</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {details.items.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    <div className="text-xs text-gray-500 whitespace-pre-line">{item.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.unitPrice}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals & Notes */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Notes & Terms:</h3>
                    {details.additionalNotes && (
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-semibold">Additional Notes:</span> {details.additionalNotes}
                        </p>
                    )}
                    {details.paymentTerms && (
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Payment Terms:</span> {details.paymentTerms}
                        </p>
                    )}
                    {details.paymentInformation?.bankName && (
                        <div className="mt-4 text-sm text-gray-600">
                            <p className="font-semibold">Bank Details:</p>
                            <p>Bank: {details.paymentInformation.bankName}</p>
                            <p>Account Name: {details.paymentInformation.accountName}</p>
                            <p>Account No: {details.paymentInformation.accountNumber}</p>
                        </div>
                    )}
                </div>
                <div className="md:text-right">
                    <div className="inline-block min-w-[200px] text-left">
                        <dl className="space-y-2">
                            <div className="flex justify-between">
                                <dt className="font-medium text-gray-700">Subtotal:</dt>
                                <dd className="text-gray-800">{formatNumberWithCommas(Number(details.subTotal))} {details.currency}</dd>
                            </div>
                            {details.discountDetails?.amount != undefined && details.discountDetails?.amount > 0 && (
                                <div className="flex justify-between">
                                    <dt className="font-medium text-gray-700">Discount:</dt>
                                    <dd className="text-gray-800">
                                        {details.discountDetails.amountType === "amount"
                                            ? `- ${details.discountDetails.amount} ${details.currency}`
                                            : `- ${details.discountDetails.amount}%`}
                                    </dd>
                                </div>
                            )}
                            {details.taxDetails?.amount != undefined && details.taxDetails?.amount > 0 && (
                                <div className="flex justify-between">
                                    <dt className="font-medium text-gray-700">Tax:</dt>
                                    <dd className="text-gray-800">
                                        {details.taxDetails.amountType === "amount"
                                            ? `+ ${details.taxDetails.amount} ${details.currency}`
                                            : `+ ${details.taxDetails.amount}%`}
                                    </dd>
                                </div>
                            )}
                            {details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 && (
                                <div className="flex justify-between">
                                    <dt className="font-medium text-gray-700">Shipping:</dt>
                                    <dd className="text-gray-800">
                                        {details.shippingDetails.costType === "amount"
                                            ? `+ ${details.shippingDetails.cost} ${details.currency}`
                                            : `+ ${details.shippingDetails.cost}%`}
                                    </dd>
                                </div>
                            )}
                            <div className="flex justify-between pt-2 border-t border-gray-300">
                                <dt className="text-xl font-bold text-gray-900">Total:</dt>
                                <dd className="text-xl font-bold text-gray-900">
                                    {formatNumberWithCommas(Number(details.totalAmount))} {details.currency}
                                </dd>
                            </div>
                            {details.totalAmountInWords && (
                                <div className="flex justify-between mt-2">
                                    <dt className="font-medium text-gray-700">Total in words:</dt>
                                    <dd className="text-gray-800 italic text-sm">
                                        {details.totalAmountInWords} {details.currency}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>

            {/* Signature */}
            {details?.signature?.data && (
                <div className="p-6 pt-4 border-t border-gray-200">
                    <p className="font-semibold text-gray-700 mb-2">Signature:</p>
                    {isDataUrl(details.signature.data) ? (
                        <img
                            src={details.signature.data}
                            width={120}
                            height={60}
                            alt={`Signature of ${sender.name}`}
                            className="border-b border-gray-300 pb-2"
                        />
                    ) : (
                        <p
                            style={{
                                fontSize: 30,
                                fontWeight: 400,
                                fontFamily: `${details.signature.fontFamily}, cursive`,
                                color: "black",
                            }}
                            className="border-b border-gray-300 pb-2 inline-block"
                        >
                            {details.signature.data}
                        </p>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="bg-gray-800 text-white text-center p-4 text-xs rounded-b-lg">
                <p>Thank you for your business!</p>
                <p className="mt-1">Questions? Contact us at {sender.email} or {sender.phone}</p>
            </div>
        </InvoiceLayout>
    );
};

export default InvoiceTemplate3;