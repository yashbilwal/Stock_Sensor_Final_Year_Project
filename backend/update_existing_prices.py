#!/usr/bin/env python3
"""
Script to update existing VCP and IPO results with current prices from sample collections
Run this to fix existing records that don't have current_price field
"""

import sys
import os
from datetime import datetime

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import mongo

def update_existing_prices():
    """Update existing VCP and IPO results with current prices from sample collections"""
    
    # Create Flask app context
    app = create_app()
    
    with app.app_context():
        # Get the collections
        vcp_results = mongo.db.VCP_results
        ipo_results = mongo.db.IPO_Base_results
        vcp_sample = mongo.db.VCP_sample
        ipo_sample = mongo.db.IPO_Base_sample
        
        print("🔧 Updating Existing Records with Current Prices")
        print("=" * 60)
        
        # Update VCP results
        print("\n📊 Updating VCP Results...")
        vcp_docs = list(vcp_results.find({"is_detected": "Yes"}))
        updated_vcp = 0
        
        for doc in vcp_docs:
            symbol = doc.get('symbol')
            if symbol:
                # Get price from VCP_sample collection
                sample_doc = vcp_sample.find_one({"symbol": symbol})
                if sample_doc and 'price' in sample_doc:
                    current_price = sample_doc['price']
                    
                    # Update the VCP result with current price
                    result = vcp_results.update_one(
                        {"_id": doc["_id"]},
                        {"$set": {"current_price": current_price}}
                    )
                    
                    if result.modified_count > 0:
                        updated_vcp += 1
                        print(f"   ✅ Updated {symbol}: ₹{current_price}")
                    else:
                        print(f"   ⚠️  {symbol}: Already has price or update failed")
                else:
                    print(f"   ❌ {symbol}: No price found in sample collection")
        
        print(f"   📈 Updated {updated_vcp} VCP records")
        
        # Update IPO results
        print("\n📊 Updating IPO Base Results...")
        ipo_docs = list(ipo_results.find({"is_detected": "Yes"}))
        updated_ipo = 0
        
        for doc in ipo_docs:
            symbol = doc.get('symbol')
            if symbol:
                # Get price from IPO_Base_sample collection
                sample_doc = ipo_sample.find_one({"symbol": symbol})
                if sample_doc and 'price' in sample_doc:
                    current_price = sample_doc['price']
                    
                    # Update the IPO result with current price
                    result = ipo_results.update_one(
                        {"_id": doc["_id"]},
                        {"$set": {"current_price": current_price}}
                    )
                    
                    if result.modified_count > 0:
                        updated_ipo += 1
                        print(f"   ✅ Updated {symbol}: ₹{current_price}")
                    else:
                        print(f"   ⚠️  {symbol}: Already has price or update failed")
                else:
                    print(f"   ❌ {symbol}: No price found in sample collection")
        
        print(f"   📈 Updated {updated_ipo} IPO Base records")
        
        # Verify the updates
        print("\n🔍 Verifying Updates...")
        
        # Check VCP results
        vcp_with_price = vcp_results.count_documents({"is_detected": "Yes", "current_price": {"$exists": True, "$ne": None}})
        vcp_total = vcp_results.count_documents({"is_detected": "Yes"})
        print(f"   VCP Results with prices: {vcp_with_price}/{vcp_total}")
        
        # Check IPO results
        ipo_with_price = ipo_results.count_documents({"is_detected": "Yes", "current_price": {"$exists": True, "$ne": None}})
        ipo_total = ipo_results.count_documents({"is_detected": "Yes"})
        print(f"   IPO Results with prices: {ipo_with_price}/{ipo_total}")
        
        print("\n" + "=" * 60)
        print("🎯 Price Update Complete!")
        
        if updated_vcp > 0 or updated_ipo > 0:
            print("💡 Now run the predicted stocks API to see the updated prices!")
        else:
            print("💡 All records already have prices or no updates were needed.")

if __name__ == "__main__":
    try:
        update_existing_prices()
    except Exception as e:
        print(f"❌ Error updating prices: {str(e)}")
        print("Make sure MongoDB is running and the backend is properly configured")
