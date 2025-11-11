import React from "react";
import InvoiceLayout from "../components/Layout/InvoiceLayout";
import { formatNumberWithCommas, isDataUrl } from "../lib/helpers";
import { DATE_OPTIONS } from "../lib/variables";

const InvoiceTemplate4 = ({ data }) => {
    const { sender, receiver, details } = data;
    return (
        <InvoiceLayout data={data}>
            <div className="flex flex-col md:flex-row min-h-[800px] border border-gray-200 rounded-lg overflow-hidden">
                {/* Left Sidebar for Sender Info */}
                <div className="md:w-1/3 bg-gray-900 text-white p-6 flex flex-col justify-between">
                    <div>
                        {details.invoiceLogo && (
                            <img
                                src={details.invoiceLogo}
                                width={100}
                                height={70}
                                alt={`Logo of ${sender.name}`}
                                className="mb-4 opacity-80"
                            />
                        )}
                        <h1 className="text-2xl font-bold mb-1">{sender.name}</h1>
                        <address className="not-italic text-sm text-gray-300 mb-4">
                            {sender.address}, {sender.zipCode}
                            <br />
                            {sender.city}, {sender.country}
                        </address>
                        <p className="text-sm text-gray-300 mb-1">Email: {sender.email}</p>
                        <p className="text-sm text-gray-300">Phone: {sender.phone}</p>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Invoice Details:</h3>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <dt className="font-medium text-gray-400">Invoice #:</dt>
                                <dd className="text-gray-100">{details.invoiceNumber}</dd>
                            </div>
                            <div className="flex justify-between items-center">
                                <dt className="font-medium text-gray-400">Invoice Date:</dt>
                                <dd className="text-gray-100">
                                    {new Date(details.invoiceDate).toLocaleDateString("en-US", DATE_OPTIONS)}
                                </dd>
                            </div>
                            <div className="flex justify-between items-center">
                                <dt className="font-medium text-gray-400">Due Date:</dt>
                                <dd className="text-gray-100">
                                    {new Date(details.dueDate).toLocaleDateString("en-US", DATE_OPTIONS)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Right Main Content */}
                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                        <div className="text-right mb-8">
                            <h2 className="text-4xl font-extrabold text-blue-700">INVOICE</h2>
                        </div>

                        {/* Bill To */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bill To:</h3>
                            <h4 className="font-bold text-gray-900">{receiver.name}</h4>
                            <address className="not-italic text-gray-600 text-sm">
                                {receiver.address}
                                <br />
                                {receiver.zipCode}, {receiver.city}
                                <br />
                                {receiver.country}
                            </address>
                        </div>

                        {/* Items Table */}
                        <div className="mt-8">
                            <div className="border border-gray-200 p-1 rounded-lg space-y-1">
                                <div className="hidden sm:grid sm:grid-cols-5 bg-gray-50 py-2 px-1 rounded-t-lg">
                                    <div className="sm:col-span-2 text-xs font-medium text-gray-600 uppercase">Item</div>
                                    <div className="text-left text-xs font-medium text-gray-600 uppercase">Qty</div>
                                    <div className="text-left text-xs font-medium text-gray-600 uppercase">Rate</div>
                                    <div className="text-right text-xs font-medium text-gray-600 uppercase">Amount</div>
                                </div>
                                <div className="hidden sm:block border-b border-gray-100"></div>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-1">
                                    {details.items.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <div className="col-span-full sm:col-span-2 py-2 border-b border-gray-100">
                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500 whitespace-pre-line">{item.description}</p>
                                            </div>
                                            <div className="py-2 border-b border-gray-100">
                                                <p className="text-gray-800">{item.quantity}</p>
                                            </div>
                                            <div className="py-2 border-b border-gray-100">
                                                <p className="text-gray-800">
                                                    {item.unitPrice} {details.currency}
                                                </p>
                                            </div>
                                            <div className="py-2 border-b border-gray-100">
                                                <p className="sm:text-right text-gray-800">
                                                    {item.total} {details.currency}
                                                </p>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="sm:hidden border-b border-gray-100"></div>
                            </div>
                        </div>

                        {/* Totals Summary */}
                        <div className="mt-6 flex justify-end">
                            <div className="w-full max-w-sm space-y-2">
                                <dl className="flex justify-between items-center border-b border-gray-100 pb-1">
                                    <dt className="font-semibold text-gray-700">Subtotal:</dt>
                                    <dd className="text-gray-800">
                                        {formatNumberWithCommas(Number(details.subTotal))} {details.currency}
                                    </dd>
                                </dl>
                                {details.discountDetails?.amount != undefined && details.discountDetails?.amount > 0 && (
                                    <dl className="flex justify-between items-center border-b border-gray-100 pb-1">
                                        <dt className="font-semibold text-gray-700">Discount:</dt>
                                        <dd className="text-gray-800">
                                            {details.discountDetails.amountType === "amount"
                                                ? `- ${details.discountDetails.amount} ${details.currency}`
                                                : `- ${details.discountDetails.amount}%`}
                                        </dd>
                                    </dl>
                                )}
                                {details.gstDetails?.rate != undefined && details.gstDetails?.rate > 0 && (
                                    <dl className="flex justify-between items-center border-b border-gray-100 pb-1">
                                        <dt className="font-semibold text-gray-700">GST {details.gstDetails.rate}% ({details.gstDetails.inclusive ? 'Inclusive' : 'Exclusive'}):</dt>
                                        <dd className="text-gray-800">
                                            + {details.gstDetails.rate}%
                                        </dd>
                                    </dl>
                                )}
                                {details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 && (
                                    <dl className="flex justify-between items-center border-b border-gray-100 pb-1">
                                        <dt className="font-semibold text-gray-700">Shipping:</dt>
                                        <dd className="text-gray-800">
                                            {details.shippingDetails.costType === "amount"
                                                ? `+ ${details.shippingDetails.cost} ${details.currency}`
                                                : `+ ${details.shippingDetails.cost}%`}
                                        </dd>
                                    </dl>
                                )}
                                <dl className="flex justify-between items-center pt-2 border-t border-blue-200">
                                    <dt className="text-xl font-bold text-blue-700">Total:</dt>
                                    <dd className="text-xl font-bold text-blue-700">
                                        {formatNumberWithCommas(Number(details.totalAmount))} {details.currency}
                                    </dd>
                                </dl>
                                {details.totalAmountInWords && (
                                    <p className="text-sm italic text-gray-600 mt-1">
                                        ({details.totalAmountInWords} {details.currency})
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Notes and Signature */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        {details.additionalNotes && (
                            <div className="mb-4">
                                <p className="font-semibold text-gray-800">Notes:</p>
                                <p className="text-sm text-gray-600">{details.additionalNotes}</p>
                            </div>
                        )}
                        {details.paymentTerms && (
                            <div className="mb-4">
                                <p className="font-semibold text-gray-800">Payment Terms:</p>
                                <p className="text-sm text-gray-600">{details.paymentTerms}</p>
                            </div>
                        )}
                        {details?.signature?.data && (
                            <div className="mt-6">
                                <p className="font-semibold text-gray-800 mb-1">Signature:</p>
                                {isDataUrl(details.signature.data) ? (
                                    <img
                                        src={details.signature.data}
                                        width={120}
                                        height={60}
                                        alt={`Signature of ${sender.name}`}
                                        className="border-b border-gray-300 pb-1"
                                    />
                                ) : (
                                    <p
                                        style={{
                                            fontSize: 30,
                                            fontWeight: 400,
                                            fontFamily: `${details.signature.fontFamily}, cursive`,
                                            color: "black",
                                        }}
                                        className="border-b border-gray-300 pb-1 inline-block"
                                    >
                                        {details.signature.data}
                                    </p>
                                )}
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-6 text-center">Thank you for your business!</p>
                    </div>
                </div>
            </div>
        </InvoiceLayout>
    );
};

export default InvoiceTemplate4;
