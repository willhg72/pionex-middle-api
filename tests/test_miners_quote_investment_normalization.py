from app.services.miners_service import MinersService


def test_quote_investment_normalized_when_matches_capital_times_leverage():
    data = {
        "quoteInvestment": "875",
        "leverage": "5",
        "usdtInvestment": "175",
    }
    value, normalized = MinersService._normalize_quote_investment(data)
    assert normalized is True
    assert value == 175.0


def test_quote_investment_not_normalized_when_no_capital_reference():
    data = {
        "quoteInvestment": "175",
        "leverage": "5",
    }
    value, normalized = MinersService._normalize_quote_investment(data)
    assert normalized is False
    assert value == 175.0
