
import React, { useState, useEffect } from "react";

import { CCard, CCardBody } from "@coreui/react";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Typography,
    Box,
    Chip,
    Stack,
    Divider,
} from "@mui/material";

// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SimpleInput from "src/components/common/simpleInput";
import api from "src/utils/api";
import { toast } from "react-toastify";

const Index = () => {
    // Available services
    const services = [
        "Home Page",
        "Home Doctor",
        "Veterinary",
        "Yoga",
        "Nursingcare",
        "Woundcare",
        "Eldercare",
        "Physiothraphy",
        "Blood Test",
        "NRI Elder Care",
        "Medicine Delivery",
        "Medical Equipment"
    ];

    // States
    const [faqList, setFaqList] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [savingService, setSavingService] = useState(null);

    // Fetch FAQs
    const getHomeFaq = async () => {
        try {
            setLoading(true);

            const response = await api.get("/getHomeFaq");

            const data = response?.data || [];

            const groupedFaqs = services.map((service) => {
                const serviceFaqs = data.filter(
                    (item) => item.service === service
                );

                return {
                    service,
                    faqs:
                        serviceFaqs.length > 0
                            ? serviceFaqs
                            : [
                                {
                                    question: "",
                                    answer: "",
                                },
                            ],
                };
            });

            setFaqList(groupedFaqs);
        } catch (error) {
            console.error("Fetch FAQ Error:", error);
            toast.error("Unable to fetch FAQs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getHomeFaq();
    }, []);

    // Accordion expand/collapse
    const handleAccordionChange = (service) => (event, isExpanded) => {
        setExpanded(isExpanded ? service : false);
    };

    // Add FAQ
    const addFaq = (serviceIndex) => {
        setFaqList((prev) =>
            prev.map((item, index) =>
                index === serviceIndex
                    ? {
                        ...item,
                        faqs: [
                            ...item.faqs,
                            {
                                question: "",
                                answer: "",
                            },
                        ],
                    }
                    : item
            )
        );
    };

    // Update question
    const handleQuestionChange = (
        serviceIndex,
        faqIndex,
        value
    ) => {
        setFaqList((prev) =>
            prev.map((item, index) =>
                index === serviceIndex
                    ? {
                        ...item,
                        faqs: item.faqs.map((faq, i) =>
                            i === faqIndex
                                ? {
                                    ...faq,
                                    question: value,
                                }
                                : faq
                        ),
                    }
                    : item
            )
        );
    };

    // Update answer
    const handleAnswerChange = (
        serviceIndex,
        faqIndex,
        value
    ) => {
        setFaqList((prev) =>
            prev.map((item, index) =>
                index === serviceIndex
                    ? {
                        ...item,
                        faqs: item.faqs.map((faq, i) =>
                            i === faqIndex
                                ? {
                                    ...faq,
                                    answer: value,
                                }
                                : faq
                        ),
                    }
                    : item
            )
        );
    };

    // Delete FAQ
    const delHomefaq = async (
        serviceIndex,
        faqIndex,
        faqId
    ) => {
        try {
            // Delete existing FAQ from backend
            if (faqId && faqId !== "null") {
                await api.post("/delHomeFaq", {
                    faqId,
                });
            }

            // Update local state
            setFaqList((prev) =>
                prev.map((item, index) =>
                    index === serviceIndex
                        ? {
                            ...item,
                            faqs: item.faqs.filter(
                                (_, i) => i !== faqIndex
                            ),
                        }
                        : item
                )
            );

            toast.success("FAQ removed successfully");
        } catch (error) {
            console.error("Delete FAQ Error:", error);
            toast.error("Unable to delete FAQ");
        }
    };

    // Save FAQs service-wise
    const submitServiceFaq = async (serviceItem) => {
        try {
            const validFaqs = serviceItem.faqs.filter(
                (faq) =>
                    faq.question?.trim() &&
                    faq.answer?.trim()
            );

            if (validFaqs.length === 0) {
                toast.error(
                    `Please enter at least one FAQ for ${serviceItem.service}`
                );
                return;
            }

            setSavingService(serviceItem.service);

            const payload = {
                service: serviceItem.service,
                faqs: validFaqs,
            };

            const response = await api.post(
                "/createHomeFaq",
                payload
            );

            toast.success(
                response?.data?.message ||
                `${serviceItem.service} FAQs saved successfully`
            );

            await getHomeFaq();
        } catch (error) {
            console.error("Save FAQ Error:", error);
            toast.error("Error while saving FAQs");
        } finally {
            setSavingService(null);
        }
    };

    // FAQ count
    const getFaqCount = (faqs) =>
        faqs.filter(
            (faq) =>
                faq.question?.trim() &&
                faq.answer?.trim()
        ).length;

    return (
        <>
            {/* Page Header */}
            <div className="bdc-container-content">
                <h1 className="bdc-item">
                    FAQ Management
                </h1>

                <p style={{ color: "#777" }}>
                    Manage frequently asked questions for
                    each service.
                </p>
            </div>

            <CCard>
                <CCardBody>

                    {loading ? (
                        <Typography textAlign="center" py={4}>
                            Loading FAQs...
                        </Typography>
                    ) : (
                        <>

                            {/* Summary */}
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={3}
                                flexWrap="wrap"
                                gap={2}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    Total Services: {services.length}
                                </Typography>

                                <Chip
                                    label={`${faqList.reduce(
                                        (total, item) =>
                                            total + getFaqCount(item.faqs),
                                        0
                                    )} Total FAQs`}
                                    color="success"
                                    variant="outlined"
                                />
                            </Box>

                            {/* Service Accordion */}
                            {faqList.map(
                                (serviceItem, serviceIndex) => (
                                    <Accordion
                                        key={serviceItem.service}
                                        expanded={
                                            expanded === serviceItem.service
                                        }
                                        onChange={handleAccordionChange(
                                            serviceItem.service
                                        )}
                                        disableGutters
                                        sx={{
                                            mb: 2,
                                            border: "1px solid #e0e0e0",
                                            borderRadius: "8px !important",
                                            boxShadow: "none",
                                            "&:before": {
                                                display: "none",
                                            },
                                            overflow: "hidden",
                                        }}
                                    >

                                        {/* Accordion Header */}
                                        <AccordionSummary
                                            // expandIcon={<ExpandMoreIcon />}
                                            sx={{
                                                backgroundColor: "#f8f9fa",
                                                minHeight: 60,
                                                "& .MuiAccordionSummary-content": {
                                                    alignItems: "center",
                                                    gap: 2,
                                                    flexWrap: "wrap",
                                                },
                                            }}
                                        >
                                            <Typography
                                                fontWeight={600}
                                                fontSize={15}
                                            >
                                                {serviceItem.service}
                                            </Typography>

                                            <Chip
                                                size="small"
                                                label={`${getFaqCount(
                                                    serviceItem.faqs
                                                )} FAQs`}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </AccordionSummary>

                                        {/* Accordion Content */}
                                        <AccordionDetails
                                            sx={{ p: 3 }}
                                        >

                                            {serviceItem.faqs.map(
                                                (faq, faqIndex) => (
                                                    <Box
                                                        key={
                                                            faq._id ||
                                                            faqIndex
                                                        }
                                                        sx={{
                                                            border: "1px solid #eee",
                                                            borderRadius: 2,
                                                            p: 2,
                                                            mb: 2,
                                                            backgroundColor: "#fff",
                                                        }}
                                                    >

                                                        <Stack
                                                            direction="row"
                                                            justifyContent="space-between"
                                                            alignItems="center"
                                                            mb={2}
                                                        >
                                                            <Typography
                                                                fontWeight={600}
                                                                color="primary"
                                                            >
                                                                FAQ #{faqIndex + 1}
                                                            </Typography>

                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                variant="outlined"
                                                                onClick={() =>
                                                                    delHomefaq(
                                                                        serviceIndex,
                                                                        faqIndex,
                                                                        faq?._id || "null"
                                                                    )
                                                                }
                                                            >
                                                                Remove
                                                            </Button>
                                                        </Stack>

                                                        {/* Question */}
                                                        <SimpleInput
                                                            title={`Question ${faqIndex + 1}`}
                                                            value={faq.question || ""}
                                                            textArea={true}
                                                            onChange={(e) =>
                                                                handleQuestionChange(
                                                                    serviceIndex,
                                                                    faqIndex,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />

                                                        {/* Answer */}
                                                        <SimpleInput
                                                            title={`Answer ${faqIndex + 1}`}
                                                            textArea={true}
                                                            value={faq.answer || ""}
                                                            onChange={(e) =>
                                                                handleAnswerChange(
                                                                    serviceIndex,
                                                                    faqIndex,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />

                                                    </Box>
                                                )
                                            )}

                                            <Divider sx={{ my: 2 }} />

                                            {/* Action Buttons */}
                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    sm: "row",
                                                }}
                                                spacing={2}
                                            >

                                                <Button
                                                    variant="outlined"
                                                    onClick={() =>
                                                        addFaq(serviceIndex)
                                                    }
                                                >
                                                    + Add FAQ
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    disabled={
                                                        savingService !== null
                                                    }
                                                    onClick={() =>
                                                        submitServiceFaq(
                                                            serviceItem
                                                        )
                                                    }
                                                >
                                                    {savingService === serviceItem.service
                                                        ? "Saving..."
                                                        : `Save ${serviceItem.service}`}
                                                </Button>

                                            </Stack>

                                        </AccordionDetails>

                                    </Accordion>
                                )
                            )}

                        </>
                    )}

                </CCardBody>
            </CCard>
        </>
    );
};

export default Index;
